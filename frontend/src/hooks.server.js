// Vika347 — защита маршрутов
import { redirect, error } from '@sveltejs/kit';
import { restoreSession } from '$lib/server/session.js';
export async function handle({ event, resolve }) {
    const path = event.url.pathname;
    if (path === '/logout' && event.request.method === 'POST') return resolve(event);
    try { await restoreSession(event); } catch { error(503, 'Java-backend недоступен'); }
    const publicPage = path === '/login' || path === '/register';
    if (!event.locals.user && !publicPage) {
        if (path.startsWith('/api/')) return new Response('Требуется авторизация', { status: 401 });
        redirect(303, '/login');
    }
    if (event.locals.user && publicPage) redirect(303, '/students');
    if ((path === '/students/new' || /^\/students\/[^/]+\/edit$/.test(path)) && event.locals.user?.role !== 'ADMIN') error(403, 'Недостаточно прав');
    const response = await resolve(event);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
}
