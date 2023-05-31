import { component$, useSignal, useTask$, useStylesScoped$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { variableService } from '../../../services';
import styles from './equals.css?inline';

export default component$(() => {
    useStylesScoped$(styles);
    const loc = useLocation();
    const variableId = loc.params.variableId;
    const variable = useSignal<Variable>();
    const copyLinkButtonText = useSignal('Copy Link');

    useTask$(async () => {
        variable.value = await variableService.getVariableData(variableId);
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
