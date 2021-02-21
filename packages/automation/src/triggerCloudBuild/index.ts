import fetch from 'node-fetch';
import { AdminApp } from '../types';

export interface TriggerCloudBuildParams {
    triggerId: string;
    substitutions?: Record<string, unknown>;
}

/**
 * ## triggerCloudBuild let's us to trigger a cloud build.
 *
 * ## Usage
 *
 * ```typescript
 * import { triggerCloudBuild } from '@rainbow-cloud-functions/automation';
 *
 * const triggerBuild = triggerCloudBuild(admin);
 *
 * await triggerBuild({
 *     triggerId: 'run-test-build',
 *     substitutions: {
 *         _CLIENT_ID: client_id,
 *         ...
 *     }
 * })
 * ```
 */
const triggerCloudBuild = (admin: AdminApp) => async (params: TriggerCloudBuildParams): Promise<Response> | null => {
    const { triggerId, substitutions = {} } = params;
    const { projectId } = admin.instanceId().app.options;
    const URL = `https://cloudbuild.googleapis.com/v1/projects/${projectId}/triggers/${triggerId}:run`;
    const { access_token } = await admin.options.credential.getAccessToken();
    const body = JSON.stringify({
        substitutions,
    });
    const response = await fetch(URL, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });
    const result = await response.json();
    if (result.error) {
        throw new Error(result.error);
    }
    return result;
};

export default triggerCloudBuild;
