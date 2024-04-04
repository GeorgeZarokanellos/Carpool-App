const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: '/home/george/Desktop/Carpool-App/backend/src/logs/app_logs' })
  ]
});

export default logger;