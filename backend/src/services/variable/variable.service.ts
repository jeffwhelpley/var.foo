import { Visitor, Variable } from '@varfoo/models';

export async function setVariableFiles(request: Request, env: any) {
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

export async function getVariableData(request: Request, env: any) {
    const { variableId } = await request.json<Variable>();
    const variableStr = await env.VARIABLE_KV.get(variableId);
    const responseBody = variableStr;
    const responseHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };
    return new Response(responseBody, { headers: responseHeaders });
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
