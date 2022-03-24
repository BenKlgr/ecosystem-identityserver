import moment from 'moment';

type Level = 'default' | 'info' | 'warning' | 'error';

function log(message: string, level: Level = 'default') {
  const consoleFunction =
    level == 'info'
      ? console.log
      : level == 'warning'
      ? console.warn
      : level == 'error'
      ? console.error
      : console.log;
  const consoleLevel =
    level == 'info'
      ? 'INFO'
      : level == 'warning'
      ? 'WARNING'
      : level == 'error'
      ? 'ERROR'
      : '~';
  const consoleColor =
    level == 'info'
      ? '\u001b[' + 34 + 'm'
      : level == 'warning'
      ? '\u001b[' + 33 + 'm'
      : level == 'error'
      ? '\u001b[' + 31 + 'm'
      : '\u001b[' + 0 + 'm';

  // const currentTimestamp = moment().format('DD.MM HH:mm:ss');
  const currentTimestamp = moment().format('HH:mm:ss');

  const formattedMessage = `${consoleColor}${consoleLevel}\t | ${currentTimestamp} | ${message}`;

  consoleFunction(formattedMessage);
}

export { log };
