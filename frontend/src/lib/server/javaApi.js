// Vika347 — серверный API-клиент
import { env } from '$env/dynamic/private';
export async function javaApi(path, options = {}, accessToken) {
    const headers = { Accept: 'application/json', ...options.headers };
    if (options.body) headers['Content-Type'] = 'application/json';
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const response = await fetch((env.JAVA_API_URL || 'http://localhost:8081/student-management/api') + path, { ...options, headers });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) {
        const err = new Error(data?.error?.message || `Ошибка сервера (${response.status})`);
        err.status = response.status;
        err.details = data?.error?.details;
        throw err;
    }
    return data;
}
