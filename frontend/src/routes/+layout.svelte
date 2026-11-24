<script>
    import favicon from '#lib/assets/favicon.svg';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Управление студентами</title>
</svelte:head>

<nav class="navbar">
    <span class="navbar__brand">Управление студентами</span>

    <div class="navbar__menu">
        <a href="/students">Студенты</a>
        <a href="/profile">Профиль</a>
        <a href="/login">Вход</a>
        <a href="/register">Регистрация</a>
    </div>
</nav>

<main class="container">
    {@render children()}
</main>

