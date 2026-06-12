import { Link } from 'react-router-dom'
import { Bell, ChevronRight, Crown, Flame, LogOut, Settings, Sparkles, Star } from 'lucide-react'
import TopStatsBar from '../../components/TopStatsBar/TopStatsBar'
import AchievementBadge from '../../components/AchievementBadge/AchievementBadge'
import { useApp } from '../../context/AppContext'
import { useStreak } from '../../hooks/useStreak'

export default function Profile() {
  const { user, achievements, notifications, markNotificationsRead, togglePremium } = useApp()
  const { streak, longestStreak } = useStreak()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="bg-white">
      <TopStatsBar />

      <div className="px-4 pt-3">
        {/* Cabeçalho do perfil — fundo grape vibrante */}
        <section
          className="relative overflow-hidden rounded-3xl p-5 text-white"
          style={{ background: '#CE82FF', boxShadow: '0 5px 0 0 #8444C2' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15"
          />
          <div className="relative flex items-center gap-4">
            <div
              className="relative grid h-20 w-20 place-items-center rounded-3xl bg-white font-display text-3xl font-bold"
              style={{ color: '#A95EE6', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.08)' }}
            >
              {user.avatar}
              {user.isPremium && (
                <span
                  className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-sun-500 text-white"
                  style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
                >
                  <Crown className="h-4 w-4" fill="white" strokeWidth={1.5} />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">Perfil</p>
              <p className="font-display text-2xl font-bold leading-tight">{user.name}</p>
              <p className="text-xs font-semibold opacity-90">Iniciante • {user.goal}</p>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/15 p-2 text-center">
            <ProfileStat
              icon={<Star className="h-4 w-4" fill="white" strokeWidth={1.5} />}
              label="XP"
              value={String(user.xp)}
            />
            <ProfileStat
              icon={<Flame className="h-4 w-4" fill="white" strokeWidth={1.5} />}
              label="Sequência"
              value={`${streak}d`}
            />
            <ProfileStat icon={<Crown className="h-4 w-4" fill="white" strokeWidth={1.5} />} label="Recorde" value={`${longestStreak}d`} />
          </div>
        </section>

        {/* CTA premium / status */}
        <section className="mt-4">
          {user.isPremium ? (
            <div
              className="flex items-center gap-3 rounded-3xl border-2 border-sun-500/40 bg-sun-400/15 p-4"
              style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-500 text-white"
                style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
              >
                <Crown className="h-6 w-6" fill="white" strokeWidth={1.5} />
              </span>
              <div className="flex-1">
                <p className="font-display text-base font-bold text-ink-900">Premium ativo</p>
                <p className="text-xs font-bold text-ink-600">Energia ilimitada</p>
              </div>
              <button
                onClick={togglePremium}
                className="text-[10px] font-bold uppercase tracking-wider text-ink-500"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <Link
              to="/premium"
              className="flex items-center justify-between rounded-3xl border-2 border-sun-500/40 bg-sun-400/15 p-4"
              style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-500 text-white"
                  style={{ boxShadow: '0 3px 0 0 #DC9F00' }}
                >
                  <Sparkles className="h-5 w-5" fill="white" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-ink-900">Conheça o Premium</p>
                  <p className="text-xs font-bold text-ink-600">Energia ilimitada e mais músicas</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-sun-600" strokeWidth={3} />
            </Link>
          )}
        </section>

        {/* Conquistas */}
        <section className="mt-6">
          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">Conquistas</p>
            <h2 className="font-display text-xl font-bold text-ink-900">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} desbloqueadas
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a) => (
              <AchievementBadge key={a.id} achievement={a} />
            ))}
          </div>
        </section>

        {/* Notificações */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-900">Notificações</h2>
            {unread > 0 && (
              <button
                onClick={markNotificationsRead}
                className="text-[10px] font-bold uppercase tracking-wider text-sky-600"
              >
                Marcar como lidas
              </button>
            )}
          </div>
          <div
            className="overflow-hidden rounded-3xl border-2 border-ink-200 bg-white"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            {notifications.map((n, idx) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 ${
                  idx > 0 ? 'border-t-2 border-ink-100' : ''
                }`}
              >
                <span
                  className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white ${
                    n.tone === 'success'
                      ? 'bg-brand-500'
                      : n.tone === 'warn'
                        ? 'bg-rose-500'
                        : 'bg-sky-500'
                  }`}
                  style={{
                    boxShadow:
                      n.tone === 'success'
                        ? '0 3px 0 0 #46A302'
                        : n.tone === 'warn'
                          ? '0 3px 0 0 #C53030'
                          : '0 3px 0 0 #0E84BC',
                  }}
                >
                  <Bell className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`font-display text-sm font-bold ${n.read ? 'text-ink-700' : 'text-ink-900'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs font-semibold text-ink-500">{n.description}</p>
                </div>
                {!n.read && <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-sky-500" />}
              </div>
            ))}
          </div>
        </section>

        {/* Configurações (mock) */}
        <section className="mt-6 pb-4">
          <h2 className="mb-2 font-display text-base font-bold text-ink-900">Configurações</h2>
          <div
            className="overflow-hidden rounded-3xl border-2 border-ink-200 bg-white"
            style={{ boxShadow: '0 3px 0 0 #E5E5E5' }}
          >
            <Setting label="Lembrete diário" value={`${user.dailyMinutes} min`} />
            <Setting label="Idioma" value="Português" />
            <Setting label="Sons da lição" value="Ativados" />
            <Setting label="Tema" value="Claro" />
            <button className="flex w-full items-center justify-between gap-3 border-t-2 border-ink-100 px-4 py-3 text-left font-display text-sm font-bold text-rose-500">
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" strokeWidth={2.4} />
                Sair da conta
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-ink-400">
            tocaê • v0.1
          </p>
        </section>
      </div>
    </div>
  )
}

function ProfileStat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="px-2 py-2">
      <p className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-90">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 font-display text-base font-bold">{value}</p>
    </div>
  )
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex w-full items-center justify-between gap-3 border-t-2 border-ink-100 px-4 py-3 text-left first:border-t-0">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-ink-400" strokeWidth={2.4} />
        <span className="font-display text-sm font-bold text-ink-800">{label}</span>
      </div>
      <span className="flex items-center gap-1 text-xs font-bold text-ink-500">
        {value}
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  )
}
