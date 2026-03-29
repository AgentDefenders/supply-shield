/**
 * Supply Shield GitHub Action -- Type definitions
 *
 * These types define the contract between the GitHub Action and the
 * Supply Shield API. They are intentionally minimal and contain no
 * internal implementation details.
 */
/** Token returned by the provision endpoint */
export interface CanaryToken {
    type: string;
    key: string;
    value: string;
    canary_id: string;
}
/** Response from POST /v1/supply-shield/provision */
export interface ProvisionResponse {
    tokens: CanaryToken[];
    expires_at: string;
}
/** Action input configuration */
export interface ActionInputs {
    email?: string;
    apiKey?: string;
    package: string;
    apiUrl: string;
}
