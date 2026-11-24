const API_BASE = process.env.JAVA_API_BASE;

// HTTP-запрос к Java backend с серверной стороны SvelteKit
export async function javaApi(event, path, { method = 'GET', body } = {}) {
    if (!API_BASE) {
        throw new Error('Не указан адрес Java backend');
    }

    const headers = {
        Accept: 'application/json'
    };

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    // Передаём cookies пользователя Java backend
    const cookie = event.request.headers.get('cookie');

    if (cookie) {
        headers.Cookie = cookie;
    }

    try {
        return await fetch(API_BASE + path, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new Error('Не удалось подключиться к Java backend');
    }
}
