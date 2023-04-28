import { Visitor } from '@varfoo/models';

export async function createVisitor(request: Request, env: any) {
    const headers = getHeadersFromRequest(request);
    const visitorId = generateVisitorIdFromHeaders(headers);
    const visitor: Visitor = { visitorId, headers, createDate: (new Date()).toString() };

    await env.VISITOR_KV.put(visitorId, JSON.stringify(visitor));

    const responseBody = JSON.stringify({ visitorId });
    const responseHeaders = {
        'Content-Type': 'application/json;charset=UTF-8"',
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

function generateVisitorIdFromHeaders(headers: any = {}): string {
    const ipAddress = headers['x-real-ip'] || headers['cf-connecting-ip'] || 'anonymous';
    return `${ipAddress}-${Date.now()}`;
}
