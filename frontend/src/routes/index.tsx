import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DropZone } from '../components/drop-zone/drop-zone';

export default component$(() => {
    return (
        <div>
            <h1>var.foo</h1>
            <div class="subtitle">Upload and Share Anything to Anyone</div>
            <DropZone></DropZone>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'var.foo',
    meta: [
        {
            name: 'description',
            content: 'Upload and Share Anything to Anyone',
        },
    ],
};
