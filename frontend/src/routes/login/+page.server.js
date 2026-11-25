// Vika347 — вход
import { fail, redirect } from '@sveltejs/kit';
import { javaApi } from '$lib/server/javaApi.js';
import { saveSession } from '$lib/server/session.js';
export const actions = { default: async ({ request, cookies }) => {
    const form = await request.formData();
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '');
    const email = String(form.get('email') || '').trim();
    try {
        const data = await javaApi('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        saveSession(cookies, data);
    } catch (err) { return fail(err.status || 503, { error: err.message, username, email }); }
    redirect(303, '/students');
} };
