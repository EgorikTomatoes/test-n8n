import { useMemo, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { api } from '../services/api';
import { useExchange } from '../context/ExchangeContext';
import CoinIcon from './CoinIcon';

export default function CreateAlertModal({ onClose, onCreated }) {
  const { market, activeUserId, setToast } = useExchange();
  const [symbol, setSymbol] = useState(market[0]?.symbol || 'BTC');
  const [condition, setCondition] = useState('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const coin = useMemo(() => market.find((item) => item.symbol === symbol), [market, symbol]);

  const submit = async (event) => {
    event.preventDefault();
    const target = Number(targetPrice);
    if (!Number.isFinite(target) || target <= 0) {
      setError('Enter a positive target price');
      return;
    }
    setBusy(true); setError('');
    try {
      const result = await api.createAlert(activeUserId, { symbol, condition, targetPrice: target });
      setToast({ type: 'success', text: 'Price alert created successfully' });
      await onCreated(result.alert);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return <div className="fixed inset-0 z-[90] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-alert-title">
    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl">
      <div className="flex items-center justify-between border-b border-line p-5 sm:p-6"><div><h2 id="create-alert-title" className="m-0 text-xl font-semibold">Create Price Alert</h2><p className="mb-0 mt-1 text-sm text-muted">Get notified when the market reaches your target.</p></div><button aria-label="Close" onClick={onClose} className="rounded-xl p-2 text-muted hover:bg-white/5 hover:text-white"><X/></button></div>
      <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
        <div><label className="label mb-2 block">Cryptocurrency</label><div className="relative"><select value={symbol} onChange={(event) => setSymbol(event.target.value)} className="w-full appearance-none rounded-xl border border-line bg-ink px-4 py-3 outline-none focus:border-lime/60">{market.map((item) => <option key={item.symbol} value={item.symbol}>{item.name} ({item.symbol})</option>)}</select></div></div>
        {coin && <div className="flex items-center justify-between rounded-xl border border-line bg-white/[.025] p-4"><div className="flex items-center gap-3"><CoinIcon coin={coin}/><div><div className="text-sm font-semibold">{coin.name}</div><div className="text-xs text-muted">Current market price</div></div></div><div className="number text-lg font-semibold">${coin.price.toLocaleString('en-US', { maximumFractionDigits: coin.price < 1 ? 5 : 2 })}</div></div>}
        <div><label className="label mb-2 block">Condition</label><div className="grid grid-cols-2 rounded-xl bg-ink p-1"><button type="button" onClick={() => setCondition('above')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${condition === 'above' ? 'bg-sky-400 text-ink' : 'text-muted'}`}>Price goes above</button><button type="button" onClick={() => setCondition('below')} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${condition === 'below' ? 'bg-sky-400 text-ink' : 'text-muted'}`}>Price goes below</button></div></div>
        <div><label htmlFor="target-price" className="label mb-2 block">Target Price</label><div className="flex rounded-xl border border-line bg-ink focus-within:border-lime/60"><span className="px-4 py-3 text-muted">$</span><input id="target-price" required min="0.00000001" step="any" type="number" value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} placeholder="0.00" className="min-w-0 flex-1 bg-transparent py-3 pr-4 outline-none"/></div></div>
        <div><label className="label mb-2 block">Notification Type</label><div className="flex items-center gap-3 rounded-xl border border-lime/20 bg-lime/[.04] p-4"><BellRing size={19} className="text-lime"/><div><div className="text-sm font-semibold">In-App Notifications</div><div className="text-xs text-muted">Delivered in your NOVA notification center</div></div></div></div>
        {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
        <div className="flex gap-3 pt-1"><button type="button" onClick={onClose} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold hover:bg-white/5">Cancel</button><button disabled={busy} className="flex-1 rounded-xl bg-lime py-3 text-sm font-bold text-ink hover:bg-[#c8ff5c] disabled:opacity-50">{busy ? 'Creating…' : 'Create Alert'}</button></div>
      </form>
    </div>
  </div>;
}
