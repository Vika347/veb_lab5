import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/env';
import { javaApi } from '#lib/server/javaApi.js';

// Получение токена из Set-Cookie ответа Java backend
function getToken(response, name) {
    const cookie = response.headers.getSetCookie()
        .find(value => value.startsWith(`${name}=`));

    if (!cookie) return null;

    return cookie.split(';')[0]
        .substring(name.length + 1)
        .replace(/^"|"$/g, '');
}

// Авторизация пользователя через Java backend
export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();

        const username = String(formData.get('username') ?? '').trim();
        const password = String(formData.get('password') ?? '');

        if (!username || !password) {
            return fail(400, {
                error: 'Заполните логин и пароль',
                username
            });
        }

        let response;

        try {
            response = await javaApi(event, '/auth/login', {
                method: 'POST',
                body: { username, password }
            });
        } catch {
            return fail(503, {
                error: 'Не удалось подключиться к серверу',
                username
            });
        }

        if (!response.ok) {
            return fail(response.status, {
                error: response.status === 401
                    ? 'Неверный логин или пароль'
                    : 'Не удалось войти в систему',
                username
            });
        }

        const accessToken = getToken(response, 'access_token');
        const refreshToken = getToken(response, 'refresh_token');

        if (!accessToken || !refreshToken) {
            return fail(502, {
                error: 'Сервер не вернул токены авторизации',
                username
            });
        }

        // Сохранение JWT в HttpOnly cookies
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            secure: !dev,
            sameSite: 'strict'
        };

        event.cookies.set('access_token', accessToken, cookieOptions);
        event.cookies.set('refresh_token', refreshToken, cookieOptions);

        redirect(303, '/profile');
    }
};
