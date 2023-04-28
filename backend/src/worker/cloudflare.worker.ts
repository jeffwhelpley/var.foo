import { log } from '@varfoo/adapters';
import { getServiceRouteHandler } from '@varfoo/services';
import { generateOptionsResponse } from './cors.util';
import { getUrlPathFromRequest } from './url.util';

export async function processCloudflareWorkerRequest(request: Request, env: any): Promise<Response> {
    log.info('New request', { extra: request });

    if (request.method === 'OPTIONS') {
        return generateOptionsResponse(request);
    }

    const urlPath = getUrlPathFromRequest(request);
    const routeHandler = getServiceRouteHandler(urlPath);

    return routeHandler.processRequest(request, env);
}