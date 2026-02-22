import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import studentRoutes from './routes/student.routes';
import connectDB from './config/db';
import { createInitialAdmin } from './controllers/admin.controller';

dotenv.config();

const app: Express = express();

// Initialize app
const initializeApp = async () => {
  // Connect Database
  await connectDB();

  // Create initial admin
  await createInitialAdmin();

  // Init Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Define Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/student', studentRoutes);

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Student Management System API', version: '1.0.0', endpoints: { health: '/health', auth: '/api/auth', admin: '/api/admin', student: '/api/student' } });
  });

  // Error handling middleware for undefined routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`\n✓ Server started on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  - GET  http://localhost:${PORT}/`);
    console.log(`  - GET  http://localhost:${PORT}/health`);
    console.log(`  - POST http://localhost:${PORT}/api/auth/admin/login`);
    console.log(`  - POST http://localhost:${PORT}/api/auth/student/login`);
  });
};

initializeApp().catch((error) => {
  console.error('Failed to initialize app:', error);
  process.exit(1);
});
