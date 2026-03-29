import { CanaryToken } from './types';
/**
 * Inject canary tokens as environment variables for subsequent workflow steps.
 *
 * Uses core.setSecret() to mask token values in GitHub Actions logs,
 * and core.exportVariable() to make them available as env vars.
 * These are two separate operations:
 * - setSecret: registers the value so it is redacted in all log output
 * - exportVariable: sets the env var for all subsequent steps in the job
 */
export declare function injectTokens(tokens: CanaryToken[]): void;
