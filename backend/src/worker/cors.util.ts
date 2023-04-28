
export function generateOptionsResponse(request: Request): Response {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        const headers: any = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Access-Control-Max-Age": "86400",
            "Access-Control-Allow-Headers": "*"
        };

        return new Response(null, { headers });
    } else {
        return new Response(null, {
            headers: {
                Allow: "GET,PUT,POST,DELETE,OPTIONS",
            },
        });
    }
}
