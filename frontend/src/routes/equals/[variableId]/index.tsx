import { component$, useSignal, useTask$, useStylesScoped$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import styles from './equals.css?inline';

const API_HOST = 'https://api.var.foo';
// const API_HOST = 'http://127.0.0.1:8787';

export default component$(() => {
    useStylesScoped$(styles);
    const loc = useLocation();
    const variableId = loc.params.variableId;
    const variable = useSignal<Variable>();
    const copyLinkButtonText = useSignal('Copy Link');

    useTask$(async () => {
        const variableResp = await fetch(`${API_HOST}/variables/getVariableData`, {
            method: 'POST',
            body: JSON.stringify({ variableId }),
            headers: { 'Content-Type': 'application/json' },
        });
        variable.value = await variableResp.json();
    });

    const copyLink = $(async function copyLink() {
        navigator.clipboard.writeText(loc.url.href);
        copyLinkButtonText.value = 'Copied!';
        await new Promise((resolve) => setTimeout(resolve, 1000));
        copyLinkButtonText.value = 'Copy Link';
    });

    return (
        <div>
            <h1>var foo</h1>
            <div class="subtitle">equals</div>
            <ul>
                {variable.value?.files?.map((file) => {
                    return (
                        <li key={file.name}>
                            <a href={file.url} target="_blank">
                                {file.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
            <div class="copybtn" onClick$={copyLink}>
                {copyLinkButtonText}
            </div>
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

interface Variable {
    variableId: string;
    visitorId: string;
    files?: VariableFile[];
    createDate?: string;
}

interface VariableFile {
    name: string;
    url: string;
    type: string;
}
