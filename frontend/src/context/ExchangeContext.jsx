import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const ExchangeContext = createContext(null);

export function ExchangeProvider({ children }) {
  const [market, setMarket] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(() => localStorage.getItem('activeUser') || 'u1');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [marketData, usersData, userData] = await Promise.all([
        api.market(), api.users(), api.user(activeUserId),
      ]);
      setMarket(marketData);
      setUsers(usersData);
      setUser(userData);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [activeUserId]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const timer = setInterval(() => refresh(true), 5000);
    return () => clearInterval(timer);
  }, [refresh]);
  useEffect(() => { localStorage.setItem('activeUser', activeUserId); }, [activeUserId]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({
    market, users, user, activeUserId, setActiveUserId, loading, error, refresh, toast, setToast,
  }), [market, users, user, activeUserId, loading, error, refresh, toast]);
  return <ExchangeContext.Provider value={value}>{children}</ExchangeContext.Provider>;
}

export const useExchange = () => useContext(ExchangeContext);
