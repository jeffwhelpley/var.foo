import { component$, useStylesScoped$, $ } from '@builder.io/qwik';
// import { QwikLogo } from "../icons/qwik";
// import { VarFooLogo } from "../icons/varfoo-logo";
import styles from './header.css?inline';

export default component$(() => {
    useStylesScoped$(styles);

    const handleCreateAccount = $(function handleCreateAccount() {
        window.alert('Feature available soon!');
    });

    const handleSignIn = $(function handleSignIn() {
        window.alert('Feature available soon!');
    });

    return (
        <header>
            <div class="logo">
                <a href="/">V</a>
            </div>
            <ul>
                <li>
                    <div class="link" onClick$={handleCreateAccount}>
                        Create Account
                    </div>
                </li>
                <li>|</li>
                <li>
                    <div class="link" onClick$={handleSignIn}>
                        Sign In
                    </div>
                </li>
            </ul>
        </header>
    );
});
