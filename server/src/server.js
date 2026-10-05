const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const { initDB, isLiveDbConnected } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'University Research Cell API',
    database_mode: isLiveDbConnected() ? 'Hostinger MySQL (Connected)' : 'Fallback In-Memory Store (Active)',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', details: err.message });
});

async function startServer() {
  await initDB();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Research Cell API running on http://localhost:${PORT}`);
    console.log(`📡 Network accessible on http://0.0.0.0:${PORT}`);
    console.log(`🗄️  Database: ${isLiveDbConnected() ? 'Hostinger Remote MySQL' : 'In-Memory Simulation'}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
      console.error(`👉 Solution: Terminate the process using port ${PORT} or change PORT in .env\n`);
    } else {
      console.error('[Server Listen Error]', err);
    }
  });
}

startServer();


