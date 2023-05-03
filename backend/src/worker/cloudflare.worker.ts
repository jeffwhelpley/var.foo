import { log, kvdb, fileStorage } from '@varfoo/adapters';
import { getServiceRouteHandler } from '@varfoo/services';
import { getWorkerRequestFromRequest } from './request.util';
import { getOptionsResponse, defaultNotFoundResponse, defaultErrorResponse, getObjectResponse } from './response.util';
import { WorkerRequestMethod } from '@varfoo/models';

export async function processCloudflareWorkerRequest(request: Request, env: any): Promise<Response> {
    // this is a hack so that our backend services can have access to KV Namespaces, R2 Buckets, etc.
    kvdb.registerEnv(env);
    fileStorage.registerEnv(env);

    // we normalize the default request coming in from Clouflare to make our lives easier
    const workerRequest = await getWorkerRequestFromRequest(request);

    // all OPTIONS requests returned right away
    if (workerRequest.method === WorkerRequestMethod.OPTIONS) {
        return getOptionsResponse(workerRequest);
    }

    // all other requests are processed by the appropriate service route handler
    const routeHandler = getServiceRouteHandler(workerRequest.method, workerRequest.urlPath);

    if (routeHandler) {
        try {
            const responseObject = await routeHandler.processRequest(workerRequest);
            return getObjectResponse(responseObject);
        } catch (ex) {
            log.error('Error processing request: ' + ex, { extra: ex });
            return defaultErrorResponse;
        }
    } else {
        return defaultNotFoundResponse;
    }
}