// iragrom — серверная валидация и сохранение
import { fail, redirect } from '@sveltejs/kit';
import { validateStudent } from '$lib/utils/validation.js';
import { javaApi } from './javaApi.js';
import { clearCache } from './studentsApi.js';
export async function saveStudent({ request, locals, params }) {
    if (locals.user?.role !== 'ADMIN') return fail(403, { error: 'Недостаточно прав' });
    const form = await request.formData();
    const student = {};
    for (const key of ['fullName','group','isuId','dormNumber','roomNumber','settlementDate','notes']) student[key] = String(form.get(key) || '');
    student.isForeigner = form.has('isForeigner');
    const errors = validateStudent(student);
    if (Object.keys(errors).length) return fail(400, { errors, student });
    const studentData = { ...student, fullName: student.fullName.trim(), group: student.group.trim().toUpperCase(), notes: student.notes.trim(), isuId: Number(student.isuId), dormNumber: Number(student.dormNumber), roomNumber: Number(student.roomNumber) };
    try {
        await javaApi(params.id ? '/students/' + encodeURIComponent(params.id) : '/students', { method: params.id ? 'PUT' : 'POST', body: JSON.stringify(studentData) }, locals.accessToken);
        clearCache();
    } catch (err) { return fail(err.status || 503, { error: err.message, errors: err.details || {}, student }); }
    redirect(303, '/students');
}
