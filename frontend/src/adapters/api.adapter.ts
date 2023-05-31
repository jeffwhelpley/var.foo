
class VarFooApi {
    async post<T>(serviceName: string, method: string, data?: any): Promise<T> {
        const opts: RequestInit = { method: 'POST' };

        if (data) {
            if (data instanceof FormData) {
                opts.body = data;
            } else {
                opts.headers = { 'Content-Type': 'application/json' };

                if (typeof data === 'string') {
                    if (data.trim().startsWith('{')) {
                        opts.body = data;
                    } else {
                        throw new Error(`Invalid post serviceName=${serviceName} method=${method} data=${data}`);
                    }
                } else {
                    opts.body = JSON.stringify(data);
                }
            }
        }

        const apiHost = import.meta.env.PUBLIC_API_HOST;
        const resp = await fetch(`${apiHost}/${serviceName}/${method}`, opts);
        const responseData = await resp.json() as T;
        return responseData;
    }
}

export const api = new VarFooApi();
