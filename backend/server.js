const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const productsRouter = require('./routes/products');
const openApiSpec = require('../docs/openapi.json');

// Structured logger — prefixes every line with ISO timestamp + service tag so
// combined `docker compose logs -f` output is easy to read and grep.
function log(level, ...args) {
  const ts = new Date().toISOString();
  const fn = level === 'error' ? console.error : console.log;
  fn(`${ts} [backend] [${level.toUpperCase()}]`, ...args);
}

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Request logger — logs every inbound HTTP request
app.use((req, _res, next) => {
  log('info', `${req.method} ${req.originalUrl}`);
  next();
});

// Swagger UI — served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  log('info', `Server running on http://localhost:${PORT}`);
  log('info', `Swagger UI:  http://localhost:${PORT}/api-docs`);
});

// Surface unhandled promise rejections so they appear in docker logs
process.on('unhandledRejection', (reason) => {
  log('error', 'Unhandled rejection:', reason);
});
