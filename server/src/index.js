require('dotenv').config();
const connect = require('./db');
const { getListenConfig } = require('./config');
const { createApp } = require('./app');

const app = createApp();
const { host: HOST, port: PORT } = getListenConfig();

connect().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`API running on ${HOST}:${PORT}`);
  });
});
