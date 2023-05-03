import { FormData } from '@cloudflare/workers-types';
export interface WorkerRequest {
    urlPath: string;
    json: () => Promise<any>;
    formData: () => Promise<FormData>;
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