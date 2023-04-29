export interface WorkerRequest {
    urlPath: string;
    json?: any;
    formData?: FormData;
    method: WorkerRequestMethod;
    headers: WorkerRequestHeaders;
}

export interface WorkerRequestHeaders {
    [key: string]: string;
}

export enum WorkerRequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
}