import { getVariableData, setVariableFiles } from './variable';
import { createVisitor } from './visitor';

const routes: ServiceRouteHandlerMap = {
    '/visitors/createVisitor': { processRequest: createVisitor },
    '/variables/serVariableFiles': { processRequest: setVariableFiles },
    '/variables/getVariableData': { processRequest: getVariableData }
};

const defaultHandler: ServiceRouteHandler = {
    processRequest: async (request: Request, env: any) => {
        return new Response('Invalid Path', { status: 400 });
    }
};

export function registerServiceRoute(urlPath: string, processRequestFn: ProcessRequestFn) {
    routes[urlPath] = { processRequest: processRequestFn };
}

export function getServiceRouteHandler(urlPath: string): ServiceRouteHandler {
    return routes[urlPath] || defaultHandler;
}

interface ServiceRouteHandlerMap {
    [url: string]: ServiceRouteHandler;
}

interface ServiceRouteHandler {
    processRequest: ProcessRequestFn;
}

type ProcessRequestFn = (request: Request, env: any) => Promise<Response>;
