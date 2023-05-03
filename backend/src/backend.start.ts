import { Request, Response } from '@cloudflare/workers-types';
import { processCloudflareWorkerRequest } from './worker';

export default {
    async fetch(request: Request, env: any): Promise<Response> {
        return processCloudflareWorkerRequest(request, env);
    },
};
