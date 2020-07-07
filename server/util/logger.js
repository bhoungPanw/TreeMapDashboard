/**
 * Configurations of logger.
 */
const winston = require("winston");
require("winston-daily-rotate-file");

const createLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ]
});

const successLoggerTransport = new winston.transports.DailyRotateFile({
  name: "access-file",
  level: "info",
  filename: "./logs/access-%DATE%.log",
  json: false,
  datePattern: "YYYY-MM-DD",
  prepend: true
});

const errorLoggerTransport = new winston.transports.DailyRotateFile({
  name: "error-file",
  level: "error",
  filename: "./logs/error-%DATE%.log",
  json: false,
  datePattern: "YYYY-MM-DD",
  prepend: true
});

const successLogger = createLogger;
successLogger.add(successLoggerTransport);

const errorLogger = createLogger;
errorLogger.add(errorLoggerTransport);

module.exports = {
  successlog: successLogger,
  errorlog: errorLogger
};
