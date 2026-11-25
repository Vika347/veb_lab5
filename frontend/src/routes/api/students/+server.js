// iragrom — поиск и фильтры через сервер SvelteKit
import { json } from '@sveltejs/kit';
import { getStudentPage } from '$lib/server/studentsApi.js';
export async function GET({ url, locals, request }) {
    try { return json(await getStudentPage(Object.fromEntries(url.searchParams), locals, request.signal)); }
    catch (err) { return json({ error: { message: err.message, details: err.details } }, { status: err.status || 503 }); }
}
