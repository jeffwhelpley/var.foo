import type { QwikDragEvent, QwikChangeEvent } from '@builder.io/qwik';
import { component$, useStylesScoped$, $, useSignal } from '@builder.io/qwik';
import styles from './drop-zone.css?inline';
import { useNavigate } from '@builder.io/qwik-city';

const API_HOST = 'https://api.var.foo';
// const API_HOST = 'http://127.0.0.1:8787';

export const DropZone = component$(() => {
    const nav = useNavigate();
    const isDropHandlerSet = useSignal(false);
    useStylesScoped$(styles);

    const uploadFiles = $(async function uploadFiles(files: File[]) {
        console.log('files are ');
        console.log(files);

        if (!files?.length) {
            console.log('No files to upload. Not doing anything.');
            return;
        } else if (files.length > 5) {
            console.error('Too many files to upload. Sorry!');
            return;
        }

        console.log('Right number of files');

        // first make sure we have visitorId
        let visitorId = window.localStorage.getItem('visitorId');
        if (!visitorId) {
            const visitorResp = await fetch(`${API_HOST}/visitors/createVisitor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const visitor = await visitorResp.json();
            visitorId = visitor.visitorId;

            if (!visitorId) {
                throw new Error('Could not get visitorId');
            }

            console.log(`got visitorId ${visitorId}`);
            window.localStorage.setItem('visitorId', visitorId || '');
        }

        console.log('Got visitor ID now');

        // now upload the files
        const formData = new FormData();
        formData.append('visitorId', visitorId || '');
        for (const file of files) {
            // if file greater than 10MB, don't upload 981767724
            console.log('checking file size ' + file.size);
            if (file.size > 10000000) {
                console.error('File too large. Max size is 10MB.');
                throw new Error('File too large. Max size is 10MB.');
            }
            console.log('File size is ok.');

            formData.append('files', file);
        }

        console.log('Got form data, about to post');

        const variableResp = await fetch(`${API_HOST}/variables/setVariableFiles`, {
            method: 'POST',
            body: formData,
        });
        const variable = await variableResp.json();
        console.log('22uploaded files with variable ' + variable.variableId);

        // TODO: redirect to the variable page
        console.log('22Everything done, now should redirect');
        nav(`/equals/${variable.variableId}`);
    });

    const handleSelectFiles = $(function handleSelectFiles(e: QwikChangeEvent) {
        const target = e.target as HTMLInputElement;
        const files = [...(target.files || [])];
        uploadFiles(files);
    });

    const handleDragEnter = $(function handleDragEnter(e: QwikDragEvent, currentTarget: HTMLElement) {
        currentTarget.classList.add('dragover');

        if (!isDropHandlerSet.value) {
            const dropArea = document.querySelector('#drop-area');
            dropArea?.addEventListener('drop', (e: any) => {
                currentTarget.classList.remove('dragover');
                uploadFiles([...e.dataTransfer.files]);
            });
            isDropHandlerSet.value = true;
        }
    });

    const handleDragLeave = $(function handleDragLeave(e: QwikDragEvent, currentTarget: HTMLElement) {
        currentTarget.classList.remove('dragover');
    });

    return (
        <div>
            <div
                id="drop-area"
                preventdefault:dragenter
                preventdefault:dragleave
                preventdefault:dragover
                preventdefault:drop
                onDragEnter$={handleDragEnter}
                onDragLeave$={handleDragLeave}
            >
                Drop Files Here
            </div>

            <div class="or">or</div>

            <form class="upload-form">
                <input type="file" id="fileElem" multiple accept="*" onChange$={handleSelectFiles} />
                <label class="button" for="fileElem">
                    Select Files
                </label>
            </form>
        </div>
    );
});
