// Vika347 — cookies и восстановление сессии
import { env } from '$env/dynamic/private';
import { javaApi } from './javaApi.js';
const options = { path: '/', httpOnly: true, sameSite: 'lax', secure: env.COOKIE_SECURE === 'true' };
export function saveSession(cookies, data, refresh = true) {
    cookies.set('accessToken', data.accessToken, { ...options, maxAge: 900 });
    if (refresh) cookies.set('refreshToken', data.refreshToken, { ...options, maxAge: 604800 });
}
export function clearSession(cookies) {
    cookies.delete('accessToken', { path: '/' });
    cookies.delete('refreshToken', { path: '/' });
}
export async function restoreSession(event) {
    const { cookies, locals } = event;
    let accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');
    if (!accessToken && !refreshToken) return;
    try {
        if (accessToken) {
            try { locals.user = await javaApi('/auth/profile', {}, accessToken); }
            catch (err) { if (err.status !== 401) throw err; accessToken = null; }
        }
        if (!accessToken && refreshToken) {
            const data = await javaApi('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
            saveSession(cookies, data, false);
            accessToken = data.accessToken;
            locals.user = await javaApi('/auth/profile', {}, accessToken);
        }
        locals.accessToken = accessToken;
    } catch (err) {
        if (err.status !== 401 && err.status !== 403) throw err;
        clearSession(cookies);
    }
}
