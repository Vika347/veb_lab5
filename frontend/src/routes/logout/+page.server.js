// Vika347 — выход
import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/server/session.js';
export function load() { redirect(303, '/students'); }
export const actions = { default: ({ cookies }) => { clearSession(cookies); redirect(303, '/login'); } };
