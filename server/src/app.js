const express = require('express');
const cors = require('cors');
const surveyRoutes = require('./survey.routes');

const allowedOrigins = [
  'https://designops-maturity.de',
  'https://www.designops-maturity.de',
  'https://designops-maturity.com',
  'https://www.designops-maturity.com',
  'https://designops-consulting.de',
  'https://www.designops-consulting.de',
  'https://designops.at',
  'https://www.designops.at',
];

// The API is only ever reached through the host's Nginx, which appends the
// real client address to X-Forwarded-For. Trusting exactly one hop makes
// req.ip that address, so the rate limiters count per visitor instead of
// putting everyone into the proxy's bucket. A hop count is used rather than
// 'loopback' because in the Compose deployment the proxy's connection arrives
// from the Docker bridge gateway, not from 127.0.0.1.
const TRUSTED_PROXY_HOPS = 1;

function createApp() {
  const app = express();

  app.set('trust proxy', TRUSTED_PROXY_HOPS);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  // Survey creation and read operations are intentionally public. Destructive
  // operations enforce their own authorization inside the router.
  app.use('/api/v1/survey', surveyRoutes);

  return app;
}

module.exports = { TRUSTED_PROXY_HOPS, createApp };
