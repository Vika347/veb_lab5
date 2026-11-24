<script>
    import { page } from '$app/state';

    let { form } = $props();
</script>

<section class="auth-card">
    <h1>Вход</h1>

    <!-- Сообщение после успешной регистрации -->
    {#if page.url.searchParams.get('registered') === '1'}
        <p>Регистрация прошла успешно! Теперь войдите в аккаунт.</p>
    {/if}

    <!-- Форма авторизации -->
    <form method="POST">
        <div class="form-group">
            <label for="login-username">Логин</label>
            <input
                id="login-username"
                name="username"
                type="text"
                value={form?.username ?? ''}
                autocomplete="username"
                required
            />
        </div>

        <div class="form-group">
            <label for="login-password">Пароль</label>
            <input
                id="login-password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
            />
        </div>

        <!-- Ошибка авторизации -->
        {#if form?.error}
            <p class="form-error" role="alert">
                {form.error}
            </p>
        {/if}

        <!-- Кнопка входа -->
        <div class="form-actions">
            <button class="btn btn--primary" type="submit">
                Войти
            </button>
        </div>
    </form>

    <!-- Переход на регистрацию -->
    <p>
        Нет аккаунта?
        <a href="/register">Зарегистрироваться</a>
    </p>
</section>
