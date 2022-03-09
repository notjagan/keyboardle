'use-strict';

const express = require('express');
const proxy = require('net-browserify');

require('dotenv').config({
  path: 'public.env',
});

const { argv } = require('yargs')
  .scriptName('proxy')
  .option('p', {
    alias: 'port',
    demandOption: true,
    default: process.env.PROXY_PORT,
    describe: 'port to host server on',
    type: 'int',
  })
  .command('[-p port]', 'start the server');

const app = express();
app.use(proxy());

app.listen(argv.port, () => {
  console.log(`Websocket proxy listening on port ${argv.port}.`);
});
