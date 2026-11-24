<script>
    let { form } = $props();
</script>

<section class="auth-card">
    <h1>Вход</h1>

    <form method="POST">
        <div class="form-group">
            <label for="login-username">Логин</label>
            <input
                id="login-username"
                name="username"
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

        {#if form?.error}
            <p class="form-error" role="alert">{form.error}</p>
        {/if}

        <div class="form-actions">
            <button class="btn btn--primary" type="submit">
                Войти
            </button>
        </div>
    </form>

    <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
</section>
