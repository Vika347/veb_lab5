// iragrom — запросы студентов и кеш на 30 секунд
import { javaApi } from './javaApi.js';
import { buildStudentsRequest, cleanParams } from './studentQuery.js';
const cache = new Map();
let version = 0;
export async function getStudents(filters, locals, signal) {
    const params = cleanParams(filters);
    const key = JSON.stringify([locals.user.username, Object.entries(params).sort()]);
    const saved = cache.get(key);
    if (saved && saved.expires > Date.now()) return saved.data;
    const currentVersion = version;
    const { path, options } = buildStudentsRequest(params);
    const data = await javaApi(path, { ...options, signal }, locals.accessToken);
    if (currentVersion === version) {
        if (cache.size >= 200) cache.clear();
        cache.set(key, { data, expires: Date.now() + 30000 });
    }
    return data;
}
// Проверяем, существует ли следующая страница, если текущая заполнена.
export async function getStudentPage(filters, locals, signal) {
    const page = Number(filters.page ?? 1);
    const size = Number(filters.size ?? 10);
    const students = await getStudents({ ...filters, page, size }, locals, signal);
    let hasNext = false;
    if (students.length === size && page < Math.floor(2147483647 / size)) {
        const nextStudents = await getStudents({ ...filters, page: page + 1, size }, locals, signal);
        hasNext = nextStudents.length > 0;
    }
    return { students, hasNext };
}
// После изменения данных кеш всех пользователей должен обновиться.
export function clearCache() { version++; cache.clear(); }
export function getStudentById(id, locals) { return javaApi('/students/' + encodeURIComponent(id), {}, locals.accessToken); }
