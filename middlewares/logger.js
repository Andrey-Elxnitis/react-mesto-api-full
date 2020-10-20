const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

// путь до папки для хранения логгов
const logs = path.join(__dirname, '../logs');

// логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logs, 'request.log') }),
  ],
  format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logs, 'error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
