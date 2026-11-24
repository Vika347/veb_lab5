// Передача данных авторизованного пользователя в layout
export function load({ locals }) {
    return {
        user: locals.user
    };
}
