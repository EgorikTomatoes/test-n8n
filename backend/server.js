import express from 'express';
import cors from 'cors';
import { store } from './data/store.js';
import { marketRoutes } from './routes/marketRoutes.js';
import { tradingRoutes } from './routes/tradingRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { tickMarket } from './services/market.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/market', marketRoutes(store));
app.use('/api/trade', tradingRoutes(store));
app.use('/api/users', userRoutes(store));
app.use((error, _request, response, _next) => response.status(500).json({ message: error.message || 'Ошибка сервера' }));

setInterval(() => {
  tickMarket(store.get());
  store.save();
}, 5000).unref();

app.listen(port, () => console.log(`API is running at http://localhost:${port}`));
