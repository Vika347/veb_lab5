<script>
    import favicon from '#lib/assets/favicon.svg';

    let { children, data } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Управление студентами</title>
</svelte:head>

<nav class="navbar">
    <a href="/" class="navbar__brand">
        Управление студентами
    </a>

    <div class="navbar__menu">
        {#if data.user}
            <!-- Меню авторизованного пользователя -->
            <a href="/students">Студенты</a>
            <a href="/profile">Профиль</a>

            <span>{data.user.username}</span>

            <form method="POST" action="/logout">
                <button type="submit">Выйти</button>
            </form>
        {:else}
            <!-- Меню гостя -->
            <a href="/login">Вход</a>
            <a href="/register">Регистрация</a>
        {/if}
    </div>
</nav>

<main class="container">
    {@render children()}
</main>


