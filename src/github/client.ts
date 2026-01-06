import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { config, logger } from '../config';

// Installation별 Octokit 캐시
const octokitCache = new Map<number, Octokit>();

/**
 * GitHub App으로 인증된 Octokit 인스턴스 생성 (App 레벨)
 */
export function createOctokitForApp(): Octokit {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.GITHUB_APP_ID,
      privateKey: config.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });
}

/**
 * 특정 Installation에 대한 Octokit 인스턴스 생성
 * Installation: GitHub App이 설치된 특정 저장소/조직
 */
export async function createOctokitForInstallation(
  installationId: number
): Promise<Octokit> {
  // 캐시 확인
  if (octokitCache.has(installationId)) {
    logger.debug(`Using cached Octokit for installation ${installationId}`);
    return octokitCache.get(installationId)!;
  }

  logger.debug(`Creating new Octokit for installation ${installationId}`);

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.GITHUB_APP_ID,
      privateKey: config.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
      installationId: installationId,
    },
  });

  // 캐시에 저장
  octokitCache.set(installationId, octokit);

  return octokit;
}

/**
 * 캐시 클리어 (토큰 만료 시 사용)
 */
export function clearOctokitCache(installationId?: number): void {
  if (installationId) {
    octokitCache.delete(installationId);
    logger.debug(`Cleared Octokit cache for installation ${installationId}`);
  } else {
    octokitCache.clear();
    logger.debug('Cleared all Octokit cache');
  }
}
