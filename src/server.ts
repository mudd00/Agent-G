import express, { Express, Request, Response, NextFunction } from 'express';
import { config, logger } from './config';
import { webhookRouter } from './webhooks/router';

const app: Express = express();
const PORT = config.PORT;

// GitHub Webhook은 raw body가 필요함 (서명 검증용)
app.use('/webhooks', express.raw({ type: 'application/json' }));

// 일반 JSON 파싱
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.NODE_ENV,
  });
});

// Webhook 라우터 연결
app.use('/webhooks', webhookRouter);

// 404 핸들러
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// 에러 핸들러
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('  Agent-G Server Started');
  console.log('='.repeat(50));
  console.log(`  Environment: ${config.NODE_ENV}`);
  console.log(`  Port: ${PORT}`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`    Health:   http://localhost:${PORT}/health`);
  console.log(`    Webhooks: http://localhost:${PORT}/webhooks/github`);
  console.log('='.repeat(50));
  console.log('');
});

export default app;
