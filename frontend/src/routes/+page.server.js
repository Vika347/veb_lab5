// Vika347 — начальная страница
import { redirect } from '@sveltejs/kit';
export function load() { redirect(303, '/students'); }
