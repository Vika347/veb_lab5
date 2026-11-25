// iragrom — удаление студента
import { json } from '@sveltejs/kit';
import { javaApi } from '$lib/server/javaApi.js';
import { clearCache } from '$lib/server/studentsApi.js';
export async function DELETE({ params, locals, request, url }) {
    if (request.headers.get('origin') !== url.origin) return json({ error: { message: 'Недопустимый источник запроса' } }, { status: 403 });
    if (locals.user.role !== 'ADMIN') return json({ error: { message: 'Недостаточно прав' } }, { status: 403 });
    try { await javaApi('/students/' + encodeURIComponent(params.id), { method: 'DELETE' }, locals.accessToken); clearCache(); return new Response(null, { status: 204 }); }
    catch (err) { return json({ error: { message: err.message } }, { status: err.status || 503 }); }
}
