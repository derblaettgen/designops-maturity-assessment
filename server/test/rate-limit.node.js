const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// No database is connected in this test. Failing fast instead of buffering
// lets a request pass the limiter and return immediately with a 500.
mongoose.set('bufferCommands', false);

const { createApp } = require('../src/app');

const WRITE_LIMIT = 5;

async function withServer(run) {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/survey`;

  try {
    await run((forwardedFor) => fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
      },
      body: '{}',
    }).then((response) => response.status));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

async function exhaustWriteLimit(submit, forwardedFor) {
  for (let attempt = 0; attempt < WRITE_LIMIT; attempt += 1) {
    assert.notEqual(await submit(forwardedFor), 429);
  }
  assert.equal(await submit(forwardedFor), 429);
}

test('visitors behind the reverse proxy get separate rate-limit buckets', async () => {
  await withServer(async (submit) => {
    await exhaustWriteLimit(submit, '203.0.113.10');

    assert.notEqual(await submit('203.0.113.11'), 429);
  });
});

test('a client-supplied X-Forwarded-For entry cannot dodge the rate limit', async () => {
  await withServer(async (submit) => {
    // Nginx appends the real client address, so only the last entry counts.
    await exhaustWriteLimit(submit, '198.51.100.1, 203.0.113.20');

    assert.equal(await submit('198.51.100.2, 203.0.113.20'), 429);
    assert.notEqual(await submit('198.51.100.1, 203.0.113.21'), 429);
  });
});
