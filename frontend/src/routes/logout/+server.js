import { redirect } from '@sveltejs/kit';
import { javaApi } from '#lib/server/javaApi.js';

// Выход пользователя из системы
export async function POST(event) {
    try {
        // Уведомляем Java backend о выходе
        await javaApi(event, '/auth/logout', {
            method: 'POST'
        });
    } catch {
        // Даже если backend недоступен,
        // локальную сессию браузера нужно завершить
    }

    // Удаляем JWT cookies из браузера
    event.cookies.delete('access_token', { path: '/' });
    event.cookies.delete('refresh_token', { path: '/' });

    // Перенаправляем пользователя на страницу входа
    redirect(303, '/login');
}
