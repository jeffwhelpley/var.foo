import { WorkerRequest, WorkerRequestMethod } from '@varfoo/models';
import { getVariableData, setVariableFiles } from './variable';
import { createVisitor } from './visitor';

const routes: ServiceRouteHandlerMap = {
    '/visitors/createVisitor': { processRequest: createVisitor },
    '/variables/serVariableFiles': { processRequest: setVariableFiles },
    '/variables/getVariableData': { processRequest: getVariableData }
};

export function registerServiceRoute(urlPath: string, processRequestFn: ProcessRequestFn) {
    routes[urlPath] = { processRequest: processRequestFn };
}

export function getServiceRouteHandler(method: WorkerRequestMethod, urlPath: string): ServiceRouteHandler {
    return routes[urlPath];
}

interface ServiceRouteHandlerMap {
    [url: string]: ServiceRouteHandler;
}

interface ServiceRouteHandler {
    processRequest: ProcessRequestFn;
}

type ProcessRequestFn = (workerRequest: WorkerRequest) => Promise<any>;
