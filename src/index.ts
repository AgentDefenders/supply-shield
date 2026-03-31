import * as core from '@actions/core';
import { provisionTokens } from './provision';
import { injectTokens } from './inject';
import { ActionInputs } from './types';

/**
 * Supply Shield GitHub Action
 *
 * Plants canary tokens as environment variables in CI/CD pipelines.
 * When a supply chain attack compromises a dependency and the attacker
 * harvests these fake credentials, they trigger instant alerts.
 *
 * CRITICAL: This action must NEVER cause a CI failure. All errors are
 * caught and logged as warnings. Exit code is always 0.
 */
async function run(): Promise<void> {
  try {
    const inputs: ActionInputs = {
      email: core.getInput('email') || undefined,
      apiKey: core.getInput('api-key') || undefined,
      package: core.getInput('package') || 'generic',
      apiUrl: core.getInput('api-url') || 'https://api.agentdefenders.ai',
    };

    // Validate: must have either email or API key
    if (!inputs.email && !inputs.apiKey) {
      core.warning(
        'Supply Shield: no email or api-key provided. ' +
        'Add email: your@email.com to enable canary token protection.',
      );
      return;
    }

    // Mask the API key if provided
    if (inputs.apiKey) {
      core.setSecret(inputs.apiKey);
    }

    const repo = process.env.GITHUB_REPOSITORY || 'unknown/unknown';

    core.info(`Supply Shield: provisioning ${inputs.package} package for ${repo}`);

    const response = await provisionTokens(inputs, repo);

    if (!response.tokens || response.tokens.length === 0) {
      core.warning('Supply Shield: no tokens returned from provision endpoint.');
      return;
    }

    injectTokens(response.tokens);

    core.info(
      `Supply Shield: ${response.tokens.length} canary tokens active ` +
      `(expires: ${response.expires_at}). ` +
      'If a compromised dependency exfiltrates these credentials, you will be alerted.',
    );
  } catch (error) {
    // NEVER fail the CI build. Supply Shield is a safety net, not a gate.
    const message = error instanceof Error ? error.message : String(error);
    core.warning(`Supply Shield: could not provision tokens. CI continuing. (${message})`);
  }
}

run();
