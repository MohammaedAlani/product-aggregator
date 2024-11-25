export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  aggregator: {
    interval: parseInt(process.env.AGGREGATOR_INTERVAL_MS, 10) || 5000,
    staleThreshold: parseInt(process.env.STALE_THRESHOLD_MS, 10) || 300000,
  },
});
