require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const bikeRoutes = require('./routes/bikeRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'backend',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/work-orders', workOrderRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

// Middleware de manejo de errores (DEBE SER ÚLTIMO)
app.use(errorHandler);

// Conectar BD e iniciar servidor
db.sequelize.authenticate()
  .then(() => {
    console.log('✓ Conexión a BD exitosa');

    // Sincronizar modelos (sin drop en prod)
    return db.sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
  })
  .then(() => {
    console.log('✓ Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`✓ API escuchando en http://localhost:${PORT}`);
      console.log(`→ Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('✗ Error:', error.message);
    process.exit(1);
  });
