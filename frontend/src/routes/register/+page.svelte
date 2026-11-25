<!-- Vika347 — регистрация -->
<script>import { enhance } from '$app/forms'; export let form; let loading = false;</script>
<h1>Регистрация</h1>
{#if form?.error}<p class="error-message">{form.error}</p>{/if}
<form method="POST" use:enhance={() => { loading = true; return async ({update}) => { await update(); loading = false; }; }}>
<div class="form-group"><label for="username">Логин</label><input id="username" name="username" required value={form?.username || ''} /></div>
<div class="form-group"><label for="email">Email</label><input id="email" name="email" type="email" required value={form?.email || ''} /></div>
<div class="form-group"><label for="password">Пароль</label><input id="password" name="password" type="password" required minlength="8"/></div>
<button class="btn btn--primary" disabled={loading}>{loading ? 'Загрузка...' : 'Зарегистрироваться'}</button>
</form>
