<!-- Vika347 — навигация и тема -->
<script>
    import '../styles/style.css';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import { navigating } from '$app/stores';
    export let data;
    let dark = false;
    let channel;
    onMount(() => {
        dark = localStorage.getItem('theme') === 'dark';
        document.body.classList.toggle('dark', dark);
        channel = new BroadcastChannel('session');
        channel.onmessage = () => { window.location.href = '/login'; };
        return () => channel.close();
    });
    function changeTheme() {
        dark = !dark;
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
</script>
<nav class="navbar">
    <span class="navbar__brand">🎓 Управление студентами</span>
    <div class="navbar__menu">
        {#if data.user}
            <a class="navbar__link" href="/students">Студенты</a>
            <a class="navbar__link" href="/profile">Профиль</a>
            <form method="POST" action="/logout" use:enhance={() => async ({ result, update }) => { if (result.type === 'redirect') channel?.postMessage('logout'); await update(); }}><button class="btn" type="submit">Выйти</button></form>
        {:else}
            <a class="navbar__link" href="/login">Вход</a><a class="navbar__link" href="/register">Регистрация</a>
        {/if}
        <button class="btn" on:click={changeTheme}>{dark ? '☀️' : '🌙'}</button>
    </div>
</nav>
<!-- iragrom — состояние загрузки при навигации -->
{#if $navigating}<div class="nav-loading" role="status">Загрузка...</div>{/if}
<main class="container"><slot /></main>
