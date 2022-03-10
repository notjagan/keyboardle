export const KeyState = {
  Absent: 'absent',
  Unknown: 'unknown',
  Present: 'present',
  Correct: 'correct',
};

export const MessageType = {
  Update: 'update',
};

export function stateToColor(state) {
  switch (state) {
    case KeyState.Absent:
      return {
        red: 0,
        green: 0,
        blue: 0,
      };
    case KeyState.Unknown:
      return {
        red: 255,
        green: 255,
        blue: 255,
      };
    case KeyState.Present:
      return {
        red: 255,
        green: 255,
        blue: 0,
      };
    case KeyState.Correct:
      return {
        red: 0,
        green: 255,
        blue: 0,
      };
    default:
      throw new Error('Unknown key state');
  }
}
