export default {
    async fetch(request: Request, env: any): Promise<Response> {
        console.log('Got request');
        console.log(request);

        if (request.method === 'OPTIONS') {
            if (
                request.headers.get("Origin") !== null &&
                request.headers.get("Access-Control-Request-Method") !== null &&
                request.headers.get("Access-Control-Request-Headers") !== null
            ) {
                // Handle CORS preflight requests.
                const headers: any = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST,OPTIONS",
                    "Access-Control-Max-Age": "86400",
                    "Access-Control-Allow-Headers": "*"
                };
                // const requestHeaders = request.headers.get("Access-Control-Request-Headers");

                // if (!requestHeaders) {
                //     headers['Access-Control-Allow-Headers'] = requestHeaders;
                // }

                return new Response(null, { headers });
            } else {
                // Handle standard OPTIONS request.
                return new Response(null, {
                    headers: {
                        Allow: "POST,OPTIONS",
                    },
                });
            }
        } else if (request.method !== 'POST') {
            return new Response('Method Not Allowed', {
                status: 405,
                headers: { Allow: 'POST,OPTIONS' }
            });
        }

        const path = getUrlPathFromRequest(request);
        switch (path) {
            case '/visitors/createVisitor':
                return createVisitor(request, env);
            case '/variables/setVariableFiles':
                return setVariableFiles(request, env);
            case '/variables/getVariableData':
                return getVariableData(request, env);
            default:
                return new Response('Invalid Path', { status: 400 });
        }

    },
};

async function createVisitor(request: Request, env: any) {
    const headers = getHeadersFromRequest(request);
    const visitorId = generateVisitorIdFromHeaders(headers);
    const visitor: Visitor = { visitorId, headers, createDate: (new Date()).toString() };

    await env.VISITOR_KV.put(visitorId, JSON.stringify(visitor));

    // console.log(`Created visitor: ${visitorId}`);

    const responseBody = JSON.stringify({ visitorId });
    const responseHeaders = {
        'Content-Type': 'application/json;charset=UTF-8"',
        'Access-Control-Allow-Origin': '*'
    };
    return new Response(responseBody, { headers: responseHeaders });
}

async function setVariableFiles(request: Request, env: any) {
    const createDate = (new Date()).toString();
    console.log('setVariableFiles');

    const formData = await request.formData();
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8"',
        'Access-Control-Allow-Origin': '*'
    };

    // 1. Make sure visitor is valid
    const visitorId = formData.get('visitorId');
    if (!visitorId) {
        console.log('setVariableFiles - no visitorId');
        return new Response('Invalid request', { status: 400, headers });
    }

    const visitor: Visitor = await env.VISITOR_KV.get(visitorId);
    if (!visitor) {
        console.log('setVariableFiles - no visitor');
        return new Response('Invalid visitorId', { status: 400, headers });
    }

    // 2. Generate variableId
    const variableId = await generateVariableId(env);
    if (!variableId) {
        console.log('setVariableFiles - no variableId');
        return new Response('Error generating variableId', { status: 500, headers });
    }

    // 3. Get the files being uploaded
    const files = formData.getAll('files') as File[];
    if (!files.length) {
        console.log('setVariableFiles - no files');
        return new Response('No files uploaded', { status: 400, headers });
    }

    console.log(`setVariableFiles - ${files.length} files`);

    const variableFiles = [];
    for (const file of files) {
        const type = file.type;
        const name = `${variableId}-${file.name}`;

        console.log(`setVariableFiles - uploading file ${name} of size ${file.size}`);
        await env.VAR_FOO_BUCKET.put(name, file.stream(), {
            httpMetadata: {
                contentType: file.type
            },
            customMetadata: {
                createdAt: createDate
            }
        });
        console.log(`setVariableFiles - uploading file ${name}: done`);

        const url = `https://file.var.foo/${name}`;
        variableFiles.push({ name: file.name, type, url });
    }

    console.log(`setVariableFiles - saving to database`);

    const variable = { variableId, }
    await env.VARIABLE_KV.put(variableId, JSON.stringify({ variableId, visitorId, files: variableFiles, createDate: createDate }));

    console.log(`setVariableFiles - saving to database: done`);

    const responseBody = JSON.stringify(variable);
    return new Response(responseBody, { headers });
}

async function getVariableData(request: Request, env: any) {
    const { variableId } = await request.json<Variable>();
    const variableStr = await env.VARIABLE_KV.get(variableId);
    const responseBody = variableStr;
    const responseHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };
    return new Response(responseBody, { headers: responseHeaders });
}

function getHeadersFromRequest(request: Request): any {
    const headers: any = {};

    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    return headers;
}

function getUrlPathFromRequest(request: Request): string {
    const url = new URL(request.url);
    return url.pathname;
}

function generateVisitorIdFromHeaders(headers: any = {}): string {
    const ipAddress = headers['x-real-ip'] || headers['cf-connecting-ip'] || 'anonymous';
    return `${ipAddress}-${Date.now()}`;
}

async function generateVariableId(env: any) {
    let attempts = 0;
    while (attempts < 5) {
        const newVariableId = crypto.randomUUID();
        const existingVariable = await env.VARIABLE_KV.get(newVariableId);
        if (!existingVariable) {
            return newVariableId;
        }
    }

    return '';
}

interface Variable {
    variableId: string;
    visitorId: string;
    files?: VariableFile[];
    createDate?: string;
}

interface VariableFile {
    name: string;
    url: string;
    type: string;
}

interface Visitor {
    visitorId: string;
    headers: any;
    createDate?: string;
}

