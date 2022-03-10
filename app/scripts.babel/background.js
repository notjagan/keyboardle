import { setProxy } from 'net-browserify/browser';
import { Client } from 'openrgb-sdk';
import { KeyState, MessageType, stateToColor } from './utils';

const keymap = require('./keymap.json');

setProxy({
  hostname: 'localhost',
  port: process.env.PROXY_PORT,
});
let client;
let keyboard;

async function run() {
  client = new Client('keyboardle', 6742, 'localhost');
  await client.connect();
  keyboard = await client.getControllerData(0);
}

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case MessageType.Update:
      await client.updateLeds(
        0,
        [...keyboard.colors.keys()]
          .map((i) => stateToColor(message.data[keymap[i]] || KeyState.Absent)),
      );
      break;
    default:
  }
});

run();
