import { Variable, WorkerRequest } from '@varfoo/models';
import { fileStorage, kvdb } from '@varfoo/adapters';
import { getVisitor } from '../visitor';

const KVDB_NAME = 'VARIABLE_KV';

export async function setVariableFiles(workerRequest: WorkerRequest): Promise<Variable> {
    const formData = await workerRequest.formData();

    if (!formData) {
        throw new Error('No formData');
    }

    const visitorId = formData.get('visitorId') as string;
    if (!visitorId) {
        throw new Error('No visitorId');
    }

    console.log('visitorId is ' + visitorId);

    const visitor = await getVisitor(visitorId);
    if (!visitor) {
        throw new Error('No visitor found for visitorId ' + visitorId);
    }

    console.log('visitor is ' + JSON.stringify(visitor, null, 2));

    const variableId = await generateNewVariableId();
    if (!variableId) {
        throw new Error('Could not generate VariableId');
    }

    console.log('variableId is ' + variableId);

    const files = formData.getAll('files') as any[];
    if (!files.length) {
        throw new Error('No files to upload');
    }

    console.log('files are ' + JSON.stringify(files, null, 2));

    const variableFiles = [];
    for (const file of files) {
        const type = file.type;
        const fileName = `${variableId}-${file.name}`;
        await fileStorage.saveFile(fileName, file);
        variableFiles.push({ name: file.name, type, url: `https://file.var.foo/${fileName}` });
    }

    const variable = { variableId, visitorId, files: variableFiles, createDate: (new Date()).toString() };
    await kvdb.saveValue(KVDB_NAME, variableId, variable);

    return variable;
}

export async function getVariableData(workerRequest: WorkerRequest): Promise<Variable> {
    const json = await workerRequest.json();
    const variableId = json?.variableId;

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
