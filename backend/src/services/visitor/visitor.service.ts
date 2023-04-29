import { Visitor, WorkerRequest, WorkerRequestHeaders } from '@varfoo/models';
import { kvdb } from '@varfoo/adapters';

const KVDB_NAME = 'VISITOR_KV';

export async function createVisitor(workerRequest: WorkerRequest): Promise<Visitor> {
    const visitor: Visitor = {
        visitorId: getVisitorId(workerRequest.headers),
        headers: workerRequest.headers,
        createDate: (new Date()).toString()
    };
    await kvdb.saveValue(KVDB_NAME, visitor.visitorId, visitor);
    return { visitorId: visitor.visitorId };
}

function getVisitorId(headers: WorkerRequestHeaders): string {
    const ipAddress = headers['x-real-ip'] || headers['cf-connecting-ip'] || 'anonymous';
    const visitorId = `${ipAddress}-${Date.now()}`;
    return visitorId
}
