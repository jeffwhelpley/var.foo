import { Visitor, Variable, WorkerRequest } from '@varfoo/models';
import { fileStorage, kvdb } from '@varfoo/adapters';

const KVDB_NAME = 'VARIABLE_KV';
const BUCKET_NAME = 'VAR_FOO_BUCKET';

export async function setVariableFiles(workerRequest: WorkerRequest): Promise<Variable> {
    const formData = workerRequest.formData;

    if (!formData) {
        throw new Error('No formData');
    }

    const visitorId = formData.get('visitorId') as string;
    if (!visitorId) {
        throw new Error('No visitorId');
    }

    const visitor = await kvdb.getValue<Visitor>(KVDB_NAME, visitorId);
    if (!visitor) {
        throw new Error('No visitor found for visitorId ' + visitorId);
    }

    const variableId = await generateNewVariableId();
    if (!variableId) {
        throw new Error('Could not generate VariableId');
    }

    const files = formData.getAll('files') as File[];
    if (!files.length) {
        throw new Error('No files to upload');
    }

    const variableFiles = [];
    for (const file of files) {
        const type = file.type;
        const fileName = `${variableId}-${file.name}`;
        await fileStorage.saveFile(BUCKET_NAME, fileName, file);
        variableFiles.push({ name: file.name, type, url: `https://file.var.foo/${fileName}` });
    }

    const variable = { variableId, visitorId, files: variableFiles, createDate: (new Date()).toString() };
    await kvdb.saveValue(KVDB_NAME, variableId, variable);

    return variable;
}

export async function getVariableData(workerRequest: WorkerRequest): Promise<Variable> {
    const variableId = workerRequest.json.variableId;

    if (!variableId) {
        throw new Error('No variableId');
    }

    return kvdb.getValue<Variable>(KVDB_NAME, variableId);
}

async function generateNewVariableId() {
    let attempts = 0;
    while (attempts < 5) {
        const newVariableId = crypto.randomUUID();
        const existingVariable = await kvdb.getValue(KVDB_NAME, newVariableId);
        if (!existingVariable) {
            return newVariableId;
        }
    }

    return '';
}
