import { ActionInputs, ProvisionResponse } from './types';
/**
 * Call the Supply Shield provision endpoint to generate canary tokens
 * for the current repository.
 *
 * Free tier: pass email, gets generic package (3 canary types).
 * Paid tier: pass API key, can select any package.
 */
export declare function provisionTokens(inputs: ActionInputs, repo: string): Promise<ProvisionResponse>;
