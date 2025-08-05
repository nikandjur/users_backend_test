// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req: Request, res: Response) =>
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
);

// 404 handler
app.use('*', (req: Request, res: Response) =>
  res.status(404).json({ error: 'Route not found' })
);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;