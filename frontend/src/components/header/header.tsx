import { component$, useStylesScoped$, $ } from '@builder.io/qwik';
import styles from './header.css?inline';

export default component$(() => {
    useStylesScoped$(styles);

    const handleCreateAccount = $(function handleCreateAccount() {
        window.alert('No need to create a new account! Just upload some files.');
    });

    const handleSignIn = $(function handleSignIn() {
        window.alert('No need to login! Just upload some files.');
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
