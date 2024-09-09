import { format } from "winston";

const winston = require('winston');
const util = require('util');

function transform(info: any) {
  const args = info[Symbol.for('splat')];
  if (args) { info.message = util.format(info.message, ...args); }
  return info;
}

function utilFormatter() { return {transform}; }

const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    utilFormatter(),     
    format.colorize(),
    format.printf(({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`),
  ),
  transports: [
    new winston.transports.File({ filename: '/home/george/Desktop/Carpool-App/backend/src/logs/app_logs.txt' })
  ],
});

export default logger;