// iragrom — сохранение студента
import { saveStudent } from '$lib/server/studentForm.js';
import { error } from '@sveltejs/kit';
import { getStudentById } from '$lib/server/studentsApi.js';
export async function load({ params, locals }) { try { return { student: await getStudentById(params.id, locals) }; } catch (err) { error(err.status || 503, err.message); } }
export const actions = { default: saveStudent };
