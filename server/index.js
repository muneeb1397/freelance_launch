import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proposalRoutes from './routes/proposal.js';
import reviewRoutes from './routes/review.js';
import contractRoutes from './routes/contract.js';
import messageRoutes from './routes/message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health / Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FreelanceLaunch API is running smoothly 🚀',
    timestamp: new Date().toISOString(),
    modules: {
      proposal: '/api/proposal',
      review: '/api/review',
      contract: '/api/contract',
      message: '/api/message'
    }
  });
});

// Mounted Member Routes
app.use('/api/proposal', proposalRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/message', messageRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found on FreelanceLaunch API server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 FreelanceLaunch Backend Server Started`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});
