import { error, redirect } from '@sveltejs/kit';
import { javaApi } from '#lib/server/javaApi.js';

// Проверка авторизации и защита маршрутов
export async function handle({ event, resolve }) {
    const path = event.url.pathname;

// Позволяем завершить сессию даже при недоступности Java backend
if (path === '/logout' && event.request.method === 'POST') {
    return resolve(event);
}

    // Маршруты c авторизацией
    const requiresAuth =
        path === '/students' ||
        path.startsWith('/students/') ||
        path === '/profile';

    // Маршруты (ADMIN)
    const requiresAdmin =
        path === '/students/new' ||
        /^\/students\/[1-9]\d*\/edit\/?$/.test(path);

    // Данные пользователя только для текущего запроса
    event.locals.user = null;

    const refreshToken = event.cookies.get('refresh_token');

    if (refreshToken) {
        let backendUnavailable = false;

        try {
            // Проверяем refresh-токен 
            const response = await javaApi(event, '/auth/refresh', {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();

                // Получаем новый access-токен 
                const cookieHeader = response.headers.get('set-cookie');
                const match = cookieHeader?.match(/(?:^|,\s*)access_token=([^;,\s]+)/);

                if (match && data?.username &&
                    ['USER', 'ADMIN'].includes(data.role)) {

                    event.cookies.set('access_token', match[1], {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: event.url.protocol === 'https:'
                    });

                    event.locals.user = {
                        username: data.username,
                        role: data.role
                    };
                } else {
                    backendUnavailable = true;
                }
            } else if (response.status === 401) {
                event.cookies.delete('access_token', { path: '/' });
                event.cookies.delete('refresh_token', { path: '/' });
            } else {
                backendUnavailable = true;
            }
        } catch {
            backendUnavailable = true;
        }

        if (backendUnavailable) {
            error(503, 'Сервис авторизации временно недоступен');
        }
    }

    // Перенаправляем неавторизованных пользователей
    if (requiresAuth && !event.locals.user) {
        redirect(303, '/login');
    }

    // Запрещаем обычному пользователю административные страницы
    if (requiresAdmin && event.locals.user?.role !== 'ADMIN') {
        error(403, 'Недостаточно прав');
    }

    return resolve(event);
}
