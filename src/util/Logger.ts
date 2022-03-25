import moment from 'moment';
import { logToFile, logFilePath } from '../config/logger.config.json';
import { appendFile, existsSync, writeFile } from 'fs';
import { LogLevel } from '../types/Logger';

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

function log(message: string, level: LogLevel = 'default', toFile: boolean = logToFile) {
  const currentTimestamp = moment().format('HH:mm:ss');

  const { consoleColor, consoleLevel, consoleFunction } = (
    levelPresets as Object
  ).hasOwnProperty(level)
    ? levelPresets[level]
    : levelPresets.default;

  const formattedMessageForLog = `${currentTimestamp} | ${consoleLevel} > ${message}`;
  const formattedMessageForConsole = `${consoleColor}${formattedMessageForLog}`;

  consoleFunction(formattedMessageForConsole);

  if (toFile) {
    logMessageToFile(formattedMessageForLog);
  }
}

function logMessageToFile(formattedMessage: string) {
  const fileDateLabel = moment().format('DD_MM_YYYY');
  const filePath = logFilePath.replace('%DATE%', fileDateLabel);

  if (existsSync(filePath)) {
    appendFile(filePath, formattedMessage + '\n', (error) => {
      if (error) log(`Failed appending to ${filePath}`, 'error', false);
    });
  } else {
    writeFile(filePath, '', (error) => {
      if (error) {
        log(`Failed creating log ${filePath}`, 'error', false);
      } else {
        logMessageToFile(formattedMessage);
      }
    });
  }
}

export { log };
