import { component$, useStylesScoped$, $, QwikDragEvent, QwikChangeEvent } from '@builder.io/qwik';
import styles from './drop-zone.css?inline';

export const DropZone = component$(() => {
    useStylesScoped$(styles);

    const handleSelectFiles = $(function handleSelectFiles(e: QwikChangeEvent) {
        const target = e.target as HTMLInputElement;
        window.alert(`Feature available soon for uploading ${target.files?.length || 0} files!`);
    });

    const handleDragEnter = $(function handleDragEnter(e: QwikDragEvent, currentTarget: HTMLElement) {
        console.log('handleDragEnter');
        // e.stopPropagation();

        // const target = currentTarget;
        // console.log('handleDragEnter target is ');
        // console.log(target);
        currentTarget.classList.add('dragover');
        // console.log('handleDragEnter target2 is ');
        // console.log(target);
    });

    const handleDragLeave = $(function handleDragLeave(e: QwikDragEvent, currentTarget: HTMLElement) {
        console.log('handleDragLeave');
        // e.stopPropagation();

        // const target = currentTarget;
        // console.log('handleDragLeave target is ');
        // console.log(target);
        currentTarget.classList.remove('dragover');
        // console.log('handleDragLeave target2 is ');
        // console.log(target);
    });

    // const handleDragOver = $(function handleDragOver(e: QwikDragEvent) {
    //     console.log('handleDragOver');
    //     e.stopPropagation();
    //     // this.classList.remove('dragover');
    //     console.log(e);
    // });

    const handleDrop = $(function handleDrop(e: QwikDragEvent, currentTarget: HTMLElement) {
        console.log('handleDrop');
        e.stopPropagation();
        currentTarget.classList.remove('dragover');
        // this.classList.remove('dragover');

        console.log(e.dataTransfer);
        window.alert(`Feature available soon!`);
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
                // onDragOver$={handleDragOver}
                onDrop$={handleDrop}
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
