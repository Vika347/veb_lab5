<script>
    // Данные пользователя приходят из +layout.server.js
    let { data } = $props();

    const roleNames = {
        ADMIN: 'Администратор',
        USER: 'Пользователь'
    };
</script>

<section class="profile-card">
    <h1>Личный кабинет</h1>

    {#if data.user}
        <h2>Добро пожаловать, {data.user.username}!</h2>

        <p>
            <strong>Логин:</strong>
            {data.user.username}
        </p>

        <p>
            <strong>Роль:</strong>
            {roleNames[data.user.role] ?? data.user.role}
        </p>

        <a href="/students" class="btn btn--primary">
            Перейти к студентам
        </a>
    {:else}
        <p>Вы не авторизованы.</p>
        <a href="/login">Войти</a>
    {/if}
</section>
