<script>
    let { form } = $props();
</script>

<section class="auth-card">
    <h1>Регистрация</h1>

    <form method="POST">
        <div class="form-group">
            <label for="username">Логин</label>
            <input
                id="username"
                name="username"
                value={form?.username ?? ''}
                minlength="3"
                maxlength="50"
                autocomplete="username"
                required
            />
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                value={form?.email ?? ''}
                autocomplete="email"
                required
            />
        </div>

        <div class="form-group">
            <label for="password">Пароль</label>
            <input
                id="password"
                name="password"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            />
        </div>

        <div class="form-group">
            <label for="confirmPassword">Повторите пароль</label>
            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            />
        </div>

        {#if form?.error}
            <p class="form-error" role="alert">
                {form.error}
            </p>
        {/if}

        <button class="btn btn--primary" type="submit">
            Зарегистрироваться
        </button>
    </form>

    <p>
        Уже есть аккаунт?
        <a href="/login">Войти</a>
    </p>
</section>
