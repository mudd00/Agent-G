import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { config, logger } from './config';
import { webhookRouter } from './webhooks/router';
import { getStats, getRecentLogs } from './services/supabase';

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

// ===== API Endpoints =====
// 통계 조회
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// 최근 로그 조회
app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const logs = await getRecentLogs(limit);
    res.json(logs);
  } catch (error) {
    logger.error('Failed to get logs:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

// Webhook 라우터 연결
app.use('/webhooks', webhookRouter);

// ===== Static Files (React Dashboard) =====
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback - React Router 지원
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  // API나 webhook 요청은 제외
  if (req.path.startsWith('/api') || req.path.startsWith('/webhooks') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // index.html이 없으면 404
      res.status(404).json({ error: 'Dashboard not built. Run: cd client && npm run build' });
    }
  });
});

// 404 핸들러 (API만)
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
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
  console.log(`    Dashboard: http://localhost:${PORT}/`);
  console.log(`    Health:    http://localhost:${PORT}/health`);
  console.log(`    Webhooks:  http://localhost:${PORT}/webhooks/github`);
  console.log(`    API Stats: http://localhost:${PORT}/api/stats`);
  console.log(`    API Logs:  http://localhost:${PORT}/api/logs`);
  console.log('='.repeat(50));
  console.log('');
});

export default app;