// iragrom — SSR списка студентов
import { error } from '@sveltejs/kit';
import { getStudentPage } from '$lib/server/studentsApi.js';
export async function load({ locals, depends }) {
    depends('app:students');
    try { return await getStudentPage({ page: 1, size: 10, sortBy: 'id', sortOrder: 'asc' }, locals); }
    catch (err) { error(err.status || 503, err.message); }
}
