const { toKeyState, MessageType } = require('./utils');

const gameApp = document.getElementsByTagName('game-app')[0];
const game = gameApp.shadowRoot.getElementById('game');
const gameKeyboard = gameApp.shadowRoot.querySelector('game-keyboard');
const keyboard = gameKeyboard.shadowRoot.getElementById('keyboard');
game.addEventListener('game-last-tile-revealed-in-row', () => {
  const states = Array.from(keyboard.getElementsByTagName('button'))
    .reduce((acc, button) => {
      const key = button.textContent;
      const keyState = toKeyState(button.getAttribute('data-state'));
      if (key.length === 1) {
        return { ...acc, [key]: keyState };
      }
      return acc;
    }, {});
  chrome.runtime.sendMessage({
    type: MessageType.Update,
    data: states,
  });
});
