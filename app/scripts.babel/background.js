import { setProxy } from 'net-browserify/browser';
import { Client } from 'openrgb-sdk';

setProxy({
  hostname: 'localhost',
  port: process.env.PROXY_PORT,
});

async function run() {
  const client = new Client('keyboardle', 6742, 'localhost');
  await client.connect();
  client.disconnect();
}

run();
