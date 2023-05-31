import { WorkerRequest } from '@varfoo/models';
import { config } from '@varfoo/adapters';

const defaultHeaders = { 'Access-Control-Allow-Origin': config.allowOrigin };

export function getDefaultNotFoundResponse() {
    return new Response('Invalid Path', { status: 400, headers: defaultHeaders });
}

export function getDefaultErrorResponse() {
    return new Response('Unknown error', { status: 500, headers: defaultHeaders });
}

export function getOptionsResponse(workerRequest: WorkerRequest): Response {
    const headers = workerRequest.headers;

    // if CORS options request, send back CORS headers
    if (!headers['Origin'] && !headers['Access-Control-Request-Method'] && !headers['Access-Control-Request-Headers']) {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': config.allowOrigin,
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Headers': '*'
            }
        });

        // else just a normal options request
    } else {
        return new Response(null, { headers: { Allow: 'POST,OPTIONS' } });
    }
}

export function getObjectResponse(obj: any) {
    obj = obj || null;

    if (obj && typeof obj === 'object') {
        obj = JSON.stringify(obj);
    }

    return new Response(obj, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': config.allowOrigin
        }
    });
}
