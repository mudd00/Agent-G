import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { config, logger } from '../config';
import { handleIssueEvent } from './issueHandler';
import { handlePREvent } from './prHandler';
import { handlePushEvent } from './pushHandler';

export const webhookRouter = Router();

/**
 * Webhook 서명 검증
 */
function verifyWebhookSignature(
  payload: Buffer,
  signature: string | undefined
): boolean {
  if (!signature || !config.GITHUB_WEBHOOK_SECRET) return false;

  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', config.GITHUB_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * GitHub Webhook 엔드포인트
 */
webhookRouter.post('/github', async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  const event = req.headers['x-github-event'] as string;
  const deliveryId = req.headers['x-github-delivery'] as string;

  logger.info(`Webhook received: ${event} (${deliveryId})`);

  // 서명 검증 (개발 환경에서는 스킵 가능)
  if (config.NODE_ENV === 'production') {
    if (!verifyWebhookSignature(req.body as Buffer, signature)) {
      logger.error('Invalid webhook signature');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }
  }

  // Body 파싱
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(req.body.toString());
  } catch {
    logger.error('Invalid JSON payload');
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  // 즉시 응답 (GitHub은 10초 내 응답 필요)
  res.status(200).json({ received: true, event, deliveryId });

  // 비동기로 이벤트 처리
  try {
    await routeEvent(event, payload);
  } catch (error) {
    logger.error('Error processing webhook:', error);
  }
});

/**
 * 이벤트를 적절한 핸들러로 라우팅
 */
async function routeEvent(
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const action = payload.action as string | undefined;
  logger.debug(`Routing event: ${event}.${action || 'N/A'}`);

  switch (event) {
    case 'issues':
      await handleIssueEvent(payload);
      break;

    case 'pull_request':
      await handlePREvent(payload);
      break;

    case 'push':
      await handlePushEvent(payload);
      break;

    case 'ping':
      logger.info('Ping event - webhook is connected!');
      break;

    default:
      logger.debug(`Unhandled event type: ${event}`);
  }
}
