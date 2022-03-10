export const KeyState = {
  Absent: 'absent',
  Unknown: 'unknown',
  Present: 'present',
  Correct: 'correct',
};

export function toKeyState(state) {
  if (state === null) {
    return KeyState.Unknown;
  }
  return Object.keys(KeyState).find((key) => KeyState[key] === state);
}

export const MessageType = {
  Update: 'update',
};
