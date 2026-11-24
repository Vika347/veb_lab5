import { fail, redirect } from '@sveltejs/kit';
import { javaApi } from '#lib/server/javaApi.js';

// Серверная обработка регистрации пользователя
export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();

        const username = String(formData.get('username') ?? '').trim();
        const email = String(formData.get('email') ?? '').trim();
        const password = String(formData.get('password') ?? '');
        const confirmPassword = String(formData.get('confirmPassword') ?? '');

        const values = { username, email };

        // Проверяем данные до отправки на Java backend
        if (username.length < 3 || username.length > 50) {
            return fail(400, {
                error: 'Логин должен содержать от 3 до 50 символов',
                ...values
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return fail(400, {
                error: 'Введите корректный email',
                ...values
            });
        }

        if (password.length < 8) {
            return fail(400, {
                error: 'Пароль должен содержать минимум 8 символов',
                ...values
            });
        }

        if (password !== confirmPassword) {
            return fail(400, {
                error: 'Пароли не совпадают',
                ...values
            });
        }

        let response;

        try {
            response = await javaApi(event, '/auth/register', {
                method: 'POST',
                body: { username, email, password }
            });
        } catch {
            return fail(503, {
                error: 'Сервер временно недоступен',
                ...values
            });
        }

        if (response.status === 409) {
            return fail(409, {
                error: 'Пользователь с таким логином или email уже существует',
                ...values
            });
        }

        if (!response.ok) {
            return fail(400, {
                error: 'Не удалось зарегистрироваться. Проверьте данные.',
                ...values
            });
        }

        // После регистрации предлагаем пользователю войти
        redirect(303, '/login?registered=1');
    }
};
