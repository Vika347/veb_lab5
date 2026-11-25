// iragrom — серверная загрузка досье
import { error } from '@sveltejs/kit';
import { getStudentById } from '$lib/server/studentsApi.js';
export async function load({ params, locals, depends }) {
    depends('app:student');
    try { return { student: await getStudentById(params.id, locals) }; }
    catch (err) { error(err.status || 503, err.message); }
}
