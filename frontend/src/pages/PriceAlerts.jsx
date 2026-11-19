import { useCallback, useEffect, useMemo, useState } from 'react';
import { BellRing, Plus, XCircle } from 'lucide-react';
import CoinIcon from '../components/CoinIcon';
import CreateAlertModal from '../components/CreateAlertModal';
import { useExchange } from '../context/ExchangeContext';
import { api } from '../services/api';

const filters = [['all', 'All'], ['active', 'Active'], ['triggered', 'Triggered'], ['cancelled', 'Cancelled']];
const statusStyles = {
  active: 'bg-sky-400/10 text-sky-300',
  triggered: 'bg-emerald-400/10 text-emerald-300',
  cancelled: 'bg-white/5 text-muted',
};
const money = (value) => `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: value < 1 ? 8 : 2 })}`;

export default function PriceAlerts() {
  const { activeUserId, market, setToast, refresh } = useExchange();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlerts = useCallback(async () => {
    try { setAlerts(await api.alerts(activeUserId)); setError(''); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [activeUserId]);

  useEffect(() => { setLoading(true); loadAlerts(); }, [loadAlerts]);
  useEffect(() => { const timer = setInterval(loadAlerts, 5000); return () => clearInterval(timer); }, [loadAlerts]);
  const visibleAlerts = useMemo(() => alerts.filter((alert) => filter === 'all' || alert.status === filter), [alerts, filter]);
  const activeCount = alerts.filter((alert) => alert.status === 'active').length;

  const cancel = async (alertId) => {
    try {
      await api.cancelAlert(activeUserId, alertId);
      setToast({ type: 'success', text: 'Price alert cancelled' });
      await loadAlerts();
    } catch (requestError) { setToast({ type: 'error', text: requestError.message }); }
  };

  const created = async () => { await Promise.all([loadAlerts(), refresh(true)]); };

  return <div className="page-enter space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-3"><span className="rounded-xl bg-lime/10 p-2.5 text-lime"><BellRing size={22}/></span><span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-300">{activeCount} active</span></div><h1 className="m-0 text-2xl font-semibold">Price Alerts</h1><p className="mb-0 mt-1 text-sm text-muted">Track price targets without watching the market all day.</p></div><button onClick={() => setModal(true)} className="flex items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink hover:bg-[#c8ff5c]"><Plus size={18}/>Create Alert</button></div>
    <section className="panel overflow-hidden">
      <div className="flex gap-2 overflow-x-auto border-b border-line p-4 scrollbar">{filters.map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === value ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`}>{label}</button>)}</div>
      {error && <div className="border-b border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">{error}</div>}
      <div className="overflow-x-auto scrollbar"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b border-line text-xs uppercase tracking-wider text-muted"><tr>{['Cryptocurrency','Condition','Target Price','Current Price','Status','Created At','Triggered At','Actions'].map((heading) => <th key={heading} className="px-5 py-4 font-medium">{heading}</th>)}</tr></thead><tbody>{visibleAlerts.map((alert) => { const coin = market.find((item) => item.symbol === alert.symbol); return <tr key={alert.id} className="border-b border-line/70 last:border-0 hover:bg-white/[.015]"><td className="px-5 py-4"><div className="flex items-center gap-3">{coin && <CoinIcon coin={coin}/>}<div><div className="font-semibold">{alert.symbol}</div><div className="text-xs text-muted">{coin?.name}</div></div></div></td><td className="px-5 py-4"><span className="capitalize">Price goes {alert.condition}</span></td><td className="number px-5 py-4 font-semibold">{money(alert.targetPrice)}</td><td className="number px-5 py-4">{coin ? money(coin.price) : '—'}</td><td className="px-5 py-4"><span className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[alert.status]}`}>{alert.status}</span></td><td className="px-5 py-4 text-muted">{new Date(alert.createdAt).toLocaleString('ru')}</td><td className="px-5 py-4 text-muted">{alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString('ru') : '—'}</td><td className="px-5 py-4">{alert.status === 'active' ? <button onClick={() => cancel(alert.id)} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted hover:border-rose-400/30 hover:text-rose-300"><XCircle size={14}/>Cancel</button> : <span className="text-muted">—</span>}</td></tr>; })}</tbody></table></div>
      {!loading && visibleAlerts.length === 0 && <div className="p-12 text-center"><BellRing className="mx-auto text-muted"/><div className="mt-3 font-semibold">No price alerts here</div><div className="mt-1 text-sm text-muted">Create an alert to start tracking a price target.</div></div>}
      {loading && <div className="p-12 text-center text-sm text-muted">Loading price alerts…</div>}
    </section>
    {modal && <CreateAlertModal onClose={() => setModal(false)} onCreated={created}/>} 
  </div>;
}
