export function getUrlPathFromRequest(request: Request): string {
    const url = new URL(request.url);
    return url.pathname;
}
