import moment from 'moment';

type Level = 'default' | 'info' | 'warning' | 'error';

const levelPresets = {
  default: {
    consoleFunction: console.log,
    consoleColor: '\u001b[' + 0 + 'm',
    consoleLevel: '~',
  },
  info: {
    consoleFunction: console.log,
    consoleColor: '\u001b[' + 34 + 'm',
    consoleLevel: 'INFO',
  },
  warning: {
    consoleFunction: console.warn,
    consoleColor: '\u001b[' + 33 + 'm',
    consoleLevel: 'WARNING',
  },
  error: {
    consoleFunction: console.error,
    consoleColor: '\u001b[' + 31 + 'm',
    consoleLevel: 'ERROR',
  },
};

function log(message: string, level: Level = 'default') {
  const currentTimestamp = moment().format('HH:mm:ss');

  const { consoleColor, consoleLevel, consoleFunction } = (
    levelPresets as Object
  ).hasOwnProperty(level)
    ? levelPresets[level]
    : levelPresets.default;

  const formattedMessage = `${consoleColor}${consoleLevel}\t | ${currentTimestamp} | ${message}`;

  consoleFunction(formattedMessage);
}

export { log };
