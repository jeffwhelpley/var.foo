const API_HOST = 'https://api.var.foo';
// const API_HOST = 'http://127.0.0.1:8787';

class VarFooApi {
    async post<T>(serviceName: string, method: string, data?: string | FormData): Promise<T> {
        const opts: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        if (data) {
            opts.body = JSON.stringify(data);
        }

        const resp = await fetch(`${API_HOST}/${serviceName}/${method}`, opts);
        const responseData = await resp.json() as T;
        return responseData;
    }
}

export const api = new VarFooApi();
