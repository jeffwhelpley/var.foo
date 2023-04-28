import { processCloudflareWorkerRequest } from '@varfoo/worker';

export default {
    async fetch(request: Request, env: any): Promise<Response> {
        return processCloudflareWorkerRequest(request, env);
    },
};



