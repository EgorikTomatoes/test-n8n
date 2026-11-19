import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

export default function Header({ onMenu }) {
  const { users, activeUserId, setActiveUserId, user } = useExchange();
  return <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur-xl sm:px-7">
    <div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-lg p-2 hover:bg-white/5 lg:hidden"><Menu /></button><div><div className="text-xs text-muted">Симулятор рынка</div><div className="text-sm font-semibold">Live trading</div></div></div>
    <div className="flex items-center gap-2 sm:gap-4">
      <button className="relative rounded-xl border border-line p-2.5 text-muted hover:text-white"><Bell size={19}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime"/></button>
      <label className="relative flex items-center gap-3 rounded-xl border border-line bg-panel py-1.5 pl-2 pr-8">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-lime to-emerald-500 text-xs font-bold text-ink">{user?.avatar || '—'}</span>
        <span className="hidden text-left sm:block"><span className="block text-sm font-semibold">{user?.name || 'Загрузка'}</span><span className="block text-[11px] text-muted">Демо-аккаунт</span></span>
        <select aria-label="Активный пользователь" value={activeUserId} onChange={(event) => setActiveUserId(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0">{users.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <ChevronDown size={15} className="absolute right-2 text-muted" />
      </label>
    </div>
  </header>;
}
