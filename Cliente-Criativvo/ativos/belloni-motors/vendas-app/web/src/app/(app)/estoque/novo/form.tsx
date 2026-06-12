'use client';

import { useActionState, useState } from 'react';
import { addCar } from './actions';
import { MoneyInput, KmInput, MultiPhotoUpload } from './inputs';

const OPCIONAIS = [
  'Ar condicionado', 'Ar digital', 'Direção elétrica', 'Direção hidráulica',
  'Vidros elétricos', 'Travas elétricas', 'Retrovisores elétricos',
  'Câmera de ré', 'Sensor de estacionamento', 'Sensor de chuva',
  'Central multimídia', 'Bluetooth', 'GPS / Navegador',
  'Banco de couro', 'Bancos aquecidos', 'Teto solar', 'Teto panorâmico',
  'Rodas de liga leve', 'Airbag duplo', 'Airbag lateral',
  'ABS', 'Controle de tração', 'Controle de estabilidade',
  'Piloto automático', 'Freio a disco nas 4 rodas',
  'Volante multifuncional', 'Keyless Entry / Start',
  'Computador de bordo', 'Start/Stop automático',
  'Carregador wireless', 'Apple CarPlay / Android Auto',
  'Kit multimídia original', '4x4 / AWD / Tração integral',
  'Blindagem', 'GNV instalado',
];

const CATEGORIAS   = ['Hatch', 'SUV', 'Sedã', 'Picape', 'Minivan', 'Cupê', 'Moto', 'Outro'];
const CAMBIOS      = ['Automático', 'Manual', 'CVT', 'Semi-automático'];
const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido', 'GNV', 'Outro'];
const PORTAS       = ['2', '4', '5'];
const CORES        = ['Branco', 'Prata', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Bege', 'Dourado', 'Laranja', 'Outra'];

const inputCls  = 'w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900 text-sm bg-white';
const selectCls = inputCls;
const labelCls  = 'block text-sm font-semibold text-neutral-800 mb-1';
const hintCls   = 'block text-xs text-neutral-500 mb-1';

export function AddCarForm() {
  const [state, formAction, pending] = useActionState(addCar, null);
  const [photos, setPhotos]   = useState<string[]>([]);
  const [opcionais, setOpc]   = useState<Set<string>>(new Set());
  const [premium, setPremium] = useState(false);

  function toggleOpc(item: string) {
    const next = new Set(opcionais);
    next.has(item) ? next.delete(item) : next.add(item);
    setOpc(next);
  }

  return (
    <form action={formAction} className="space-y-6 bg-white rounded-2xl border border-neutral-200 p-5">

      <div>
        <span className={labelCls}>Fotos do carro</span>
        <span className={hintCls}>Primeira foto vira a capa. Pode adicionar quantas quiser.</span>
        <MultiPhotoUpload photos={photos} onChange={setPhotos} />
      </div>

      <div>
        <label className={labelCls}>Nome completo *</label>
        <span className={hintCls}>Ex: Toyota Corolla 2.0 XEi Flex Aut. 4p 2023</span>
        <input name="name" required placeholder="Toyota Corolla 2.0 XEi..." className={`${inputCls} text-base`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Marca</label>
          <input name="brand" placeholder="Toyota" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Categoria</label>
          <select name="category" className={selectCls}>
            <option value="">Selecionar</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Ano</label>
          <input name="year" placeholder="2023" maxLength={4} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Quilometragem</label>
          <KmInput name="km" />
        </div>
        <div>
          <label className={labelCls}>Portas</label>
          <select name="doors" className={selectCls}>
            <option value="">—</option>
            {PORTAS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Cor</label>
          <select name="cor" className={selectCls}>
            <option value="">—</option>
            {CORES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Câmbio</label>
          <select name="cambio" className={selectCls}>
            <option value="">—</option>
            {CAMBIOS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Combustível</label>
          <select name="combustivel" className={selectCls}>
            <option value="">—</option>
            {COMBUSTIVEIS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <span className={labelCls}>Opcionais</span>
        <span className={hintCls}>Clique para marcar. Pode marcar quantos quiser.</span>
        <div className="flex flex-wrap gap-2">
          {OPCIONAIS.map((o) => (
            <button key={o} type="button" onClick={() => toggleOpc(o)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition
                ${opcionais.has(o) ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500'}`}>
              {o}
            </button>
          ))}
        </div>
        <input type="hidden" name="opcionais" value={[...opcionais].join(',')} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <button type="button" role="switch" aria-checked={premium}
          onClick={() => setPremium((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${premium ? 'bg-neutral-900' : 'bg-neutral-300'}`}>
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${premium ? 'translate-x-5' : ''}`} />
        </button>
        <span>
          <span className="text-sm font-semibold text-neutral-800">Carro premium</span>
          <span className="block text-xs text-neutral-500">Aparece na coleção "Premium" no site</span>
        </span>
        <input type="hidden" name="premium" value={premium ? 'on' : 'off'} />
      </label>

      <div className="border-t border-neutral-100 pt-5 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">Valores (só você vê)</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Preço de tabela *</label>
            <MoneyInput name="price" required placeholder="85.000" />
          </div>
          <div>
            <label className={labelCls}>Custo</label>
            <span className={hintCls}>O vendedor nunca vê.</span>
            <MoneyInput name="cost" placeholder="70.000" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Data de aquisição</label>
          <span className={hintCls}>Pra calcular giro no estoque.</span>
          <input name="acquisition_date" type="date" className={inputCls} />
        </div>
      </div>

      {state?.error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{state.error}</p>}

      <button type="submit" disabled={pending}
        className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-950 disabled:opacity-60 text-white font-semibold py-3 text-base">
        {pending ? 'Salvando...' : 'Adicionar ao estoque'}
      </button>
    </form>
  );
}
