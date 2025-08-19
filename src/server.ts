import express from 'express';
import { getOrdersDetailed } from './orders/service.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/orders/detailed', async (req, res) => {
  const limit = Number(req.query.limit ?? 50);
  try {
    const data = await getOrdersDetailed(limit);
    res.json({ ok: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message ?? 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`TechFlow API listening on http://localhost:${PORT}`);
});
