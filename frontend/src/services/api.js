const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Не удалось выполнить запрос');
  return data;
};

export const api = {
  market: () => request('/market'),
  users: () => request('/users'),
  user: (id) => request(`/users/${id}`),
  history: (id, params = {}) => request(`/users/${id}/history?${new URLSearchParams(params)}`),
  leaderboard: () => request('/users/leaderboard'),
  trade: (type, payload) => request(`/trade/${type}`, { method: 'POST', body: JSON.stringify(payload) }),
};
