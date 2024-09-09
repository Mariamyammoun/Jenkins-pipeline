const express = require('express');
const winston = require('winston');
const app = express();
const port = process.env.PORT || 3000;

// Configurer le logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

app.get('/', (req, res) => {
  res.send('Hello, world! This is My JS app');
});

app.listen(port, () => {
  logger.info(`App listening at http://localhost:${port}`);
});

