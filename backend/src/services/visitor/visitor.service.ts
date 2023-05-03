import { Visitor, WorkerRequest, WorkerRequestHeaders } from '@varfoo/models';
import { kvdb } from '@varfoo/adapters';

const KVDB_NAME = 'VISITOR_KV';

export async function createVisitor(workerRequest: WorkerRequest): Promise<Visitor> {
    console.log('creating visitor Id');
    const visitor: Visitor = {
        visitorId: getVisitorId(workerRequest.headers),
        headers: workerRequest.headers,
        createDate: (new Date()).toString()
    };

    console.log('attempting to save visitorId ' + visitor.visitorId);

    await kvdb.saveValue(KVDB_NAME, visitor.visitorId, visitor);

    console.log('saved visitor');

    const savedVisitor = await kvdb.getValue<Visitor>(KVDB_NAME, visitor.visitorId);

    console.log('saved visitor is ' + JSON.stringify(savedVisitor, null, 2));

    return { visitorId: visitor.visitorId };
}

export async function getVisitor(visitorId: string): Promise<Visitor> {
    return kvdb.getValue<Visitor>(KVDB_NAME, visitorId);
}

function getVisitorId(headers: WorkerRequestHeaders): string {
    const ipAddress = headers['x-real-ip'] || headers['cf-connecting-ip'] || 'anonymous';
    const visitorId = `${ipAddress}-${Date.now()}`;
    return visitorId
}
