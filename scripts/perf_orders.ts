import axios from 'axios';

function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function run() {
  const N = 50;
  const times: number[] = [];
  for (let i = 0; i < N; i++) {
    const t0 = Date.now();
    await axios.get('http://localhost:3000/orders/detailed?limit=50');
    times.push(Date.now() - t0);
  }
  const p95 = percentile(times, 95);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / N);
  console.log(`Requests: ${N}, avg=${avg}ms, p95=${p95}ms`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
