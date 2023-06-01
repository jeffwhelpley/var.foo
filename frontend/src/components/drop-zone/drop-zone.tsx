import type { QwikDragEvent, QwikChangeEvent } from '@builder.io/qwik';
import { component$, useStylesScoped$, $, useSignal } from '@builder.io/qwik';
import styles from './drop-zone.css?inline';
import { useNavigate } from '@builder.io/qwik-city';
import { visitorService, variableService } from '../../services';

export const DropZone = component$(() => {
    const nav = useNavigate();
    const isDropHandlerSet = useSignal(false);
    const isOverlayVisible = useSignal(false);

    useStylesScoped$(styles);

    const uploadFiles = $(async function uploadFiles(files: File[]) {
        if (!files?.length) {
            console.log('No files to upload. Not doing anything.');
            return;
        } else if (files.length > 5) {
            window.alert('Too many files to upload. Sorry!');
            return;
        }

        isOverlayVisible.value = true;

        // first make sure we have visitorId
        let visitorId = window.localStorage.getItem('visitorId');
        if (!visitorId) {
            const visitor = await visitorService.createVisitor();
            visitorId = visitor?.visitorId;

            if (!visitorId) {
                isOverlayVisible.value = false;
                throw new Error('Could not get visitorId');
            }

            window.localStorage.setItem('visitorId', visitorId || '');
        }

        // now upload the files
        const variable = await variableService.setVariableFiles(visitorId, files);

        // files saved, so now navigate to the variable page
        isOverlayVisible.value = false;
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
            {isOverlayVisible.value && (
                <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
            {isOverlayVisible.value && <div class="lds-overlay"></div>}
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
