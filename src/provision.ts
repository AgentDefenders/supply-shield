import { ActionInputs, ProvisionResponse } from './types';

/**
 * Call the Supply Shield provision endpoint to generate canary tokens
 * for the current repository.
 *
 * Free tier: pass email, gets generic package (3 canary types).
 * Paid tier: pass API key, can select any package.
 */
export async function provisionTokens(
  inputs: ActionInputs,
  repo: string,
): Promise<ProvisionResponse> {
  const url = `${inputs.apiUrl}/v1/supply-shield/provision`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'supply-shield-action/1.0',
  };

  if (inputs.apiKey) {
    headers['Authorization'] = `Bearer ${inputs.apiKey}`;
  }

  const body = {
    email: inputs.email,
    package: inputs.package,
    repo,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown error');
    throw new Error(
      `Provision failed (HTTP ${response.status}): ${text}`,
    );
  }

  return (await response.json()) as ProvisionResponse;
}
