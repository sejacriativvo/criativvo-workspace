// Integração com a API de Marketing da Meta (Facebook/Instagram Ads).
// Puxa GASTO (spend) e CONVERSAS INICIADAS por mensagem, por dia, agrega nas 4
// semanas do mês (mesmos cortes do relatório) e grava nos campos AZUIS do
// ad_reports (investimento + conversas) — substituindo a digitação manual.
//
// Mapeamento: 1 conta de anúncio = 1 loja (Ibitinga e Borborema têm contas
// separadas). Só mexe nos campos azuis; vendidos/lucro (verdes) ficam intactos.
// Fail-closed: sem token/contas configurados, não roda.
import crypto from 'node:crypto';
import { createAdminClient } from './supabase/admin';
import { weekIndexForDay, weeksOfMonth, isLiveMonth } from './relatorios';
import type { Store } from './types';

const API_VERSION = process.env.META_API_VERSION || 'v21.0';

// Conta de anúncio de cada loja (só o número, com ou sem o prefixo 'act_').
// Cada loja pode ter o próprio token (caso Ibitinga e Borborema estejam em
// portfólios empresariais diferentes). Se não houver token específico da loja,
// cai no token único META_ACCESS_TOKEN.
type Account = { store: Store; accountId: string; token: string };

function accountMap(): Account[] {
  const shared = process.env.META_ACCESS_TOKEN?.trim();
  const out: Account[] = [];
  const add = (store: Store, accEnv?: string, tokenEnv?: string) => {
    const acc = accEnv?.trim();
    const token = tokenEnv?.trim() || shared;
    if (acc && token) out.push({ store, accountId: acc.replace(/^act_/, ''), token });
  };
  add('ibitinga', process.env.META_AD_ACCOUNT_IBITINGA, process.env.META_ACCESS_TOKEN_IBITINGA);
  add('borborema', process.env.META_AD_ACCOUNT_BORBOREMA, process.env.META_ACCESS_TOKEN_BORBOREMA);
  return out;
}

export function metaConfigured(): boolean {
  return accountMap().length > 0;
}

export type MetaSyncResult = {
  ok: boolean;
  error?: string;
  stores?: { store: Store; investimento: number; conversas: number; weeks: number }[];
};

// Mês atual no fuso de SP (e o anterior nos primeiros dias, pra fechar a virada).
// Só meses "vivos" (de Junho/2026 em diante) — nunca toca no histórico importado.
function targetMonths(): { year: number; month: number }[] {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [y, m, d] = fmt.format(new Date()).split('-').map(Number);
  const months = [{ year: y, month: m }];
  if (d <= 5) {
    months.push(m === 1 ? { year: y - 1, month: 12 } : { year: y, month: m - 1 });
  }
  return months.filter((mm) => isLiveMonth(mm.year, mm.month));
}

type InsightRow = {
  date_start: string; // 'YYYY-MM-DD'
  spend?: string;
  actions?: { action_type: string; value: string }[];
};

// Prova do app secret (exigida quando o app tem "Require app secret" ligado).
function appSecretProof(token: string): string {
  const secret = process.env.META_APP_SECRET;
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
}

// "Conversas iniciadas por mensagem" — soma as ações de conversa iniciada.
function conversationsFrom(row: InsightRow): number {
  if (!row.actions) return 0;
  let total = 0;
  for (const a of row.actions) {
    if (a.action_type.includes('messaging_conversation_started')) {
      total += Number(a.value) || 0;
    }
  }
  return total;
}

async function fetchInsights(
  accountId: string,
  token: string,
  since: string,
  until: string,
): Promise<InsightRow[]> {
  const params = new URLSearchParams({
    access_token: token,
    level: 'account',
    time_increment: '1', // quebra por dia (pra agregar nas semanas certas)
    time_range: JSON.stringify({ since, until }),
    fields: 'spend,actions',
    limit: '500',
  });
  const proof = appSecretProof(token);
  if (proof) params.set('appsecret_proof', proof);

  type InsightResponse = {
    data?: InsightRow[];
    paging?: { next?: string };
    error?: { message?: string };
  };

  const rows: InsightRow[] = [];
  let next: string | null =
    `https://graph.facebook.com/${API_VERSION}/act_${accountId}/insights?${params.toString()}`;
  for (let guard = 0; next && guard < 12; guard++) {
    const res: Response = await fetch(next, { cache: 'no-store' });
    const json = (await res.json()) as InsightResponse;
    if (!res.ok || json.error) {
      throw new Error(`Conta ${accountId}: ${json?.error?.message ?? `HTTP ${res.status}`}`);
    }
    rows.push(...(json.data ?? []));
    next = json.paging?.next ?? null;
  }
  return rows;
}

export async function runMetaSync(): Promise<MetaSyncResult> {
  if (!metaConfigured()) {
    return { ok: false, error: 'Meta não configurada (defina META_ACCESS_TOKEN e as contas).' };
  }
  const months = targetMonths();
  if (!months.length) return { ok: true, stores: [] };

  const supabase = createAdminClient();
  const accounts = accountMap();
  const summary: NonNullable<MetaSyncResult['stores']> = [];

  try {
    for (const { store, accountId, token } of accounts) {
      let invTotal = 0;
      let convTotal = 0;
      let weekCount = 0;

      for (const { year, month } of months) {
        const last = new Date(year, month, 0).getDate();
        const mm = String(month).padStart(2, '0');
        const since = `${year}-${mm}-01`;
        const until = `${year}-${mm}-${String(last).padStart(2, '0')}`;
        const insights = await fetchInsights(accountId, token, since, until);

        // Agrega os dias do mês nas 4 semanas (1-8, 9-15, 16-22, 23-fim).
        const byWeek = new Map<number, { inv: number; conv: number }>();
        for (const row of insights) {
          const day = Number(row.date_start.split('-')[2]);
          if (!day) continue;
          const wi = weekIndexForDay(day);
          const cur = byWeek.get(wi) ?? { inv: 0, conv: 0 };
          cur.inv += Number(row.spend) || 0;
          cur.conv += conversationsFrom(row);
          byWeek.set(wi, cur);
        }

        const labels = weeksOfMonth(year, month);
        // Só os campos azuis + chave: o upsert não toca em vendidos/lucro (verdes).
        const upserts = [...byWeek.entries()].map(([wi, v]) => ({
          store,
          year,
          month,
          granularity: 'week' as const,
          period_index: wi,
          period_label: labels[wi]?.label ?? null,
          investimento: Math.round(v.inv * 100) / 100,
          conversas: Math.round(v.conv),
          updated_at: new Date().toISOString(),
          updated_by: null,
        }));

        if (upserts.length) {
          const { error } = await supabase
            .from('ad_reports')
            .upsert(upserts, { onConflict: 'store,year,month,granularity,period_index' });
          if (error) throw new Error(`Gravar ${store} ${mm}/${year}: ${error.message}`);
          weekCount += upserts.length;
          for (const u of upserts) {
            invTotal += u.investimento;
            convTotal += u.conversas;
          }
        }
      }

      summary.push({ store, investimento: Math.round(invTotal), conversas: convTotal, weeks: weekCount });
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Falha ao sincronizar a Meta.' };
  }

  return { ok: true, stores: summary };
}
