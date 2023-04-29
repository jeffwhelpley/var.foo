import { WorkerRequest, WorkerRequestHeaders, WorkerRequestMethod } from '@varfoo/models';

export async function getWorkerRequestFromRequest(request: Request): Promise<WorkerRequest> {
    return {
        urlPath: getUrlPathFromRequest(request),
        json: await request.json(),
        formData: await request.formData(),
        method: request.method as WorkerRequestMethod,
        headers: getHeadersFromRequest(request),
    };
}

export function getUrlPathFromRequest(request: Request): string {
    const url = new URL(request.url);
    return url.pathname;
}

export function getHeadersFromRequest(request: Request): WorkerRequestHeaders {
    const headers: WorkerRequestHeaders = {};

    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    return headers;
}

