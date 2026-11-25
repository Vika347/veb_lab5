// iragrom — клиентские запросы через SvelteKit
async function apiRequest(url, options = {}) {
    const response = await fetch('/api' + url, options);
    if (response.status === 401) { window.location.href = '/login'; throw new Error('Сессия завершена'); }
    if (response.status === 204) return;
    const data = await response.json();
    if (!response.ok) { const err = new Error(data.error?.message || 'Ошибка запроса'); err.status = response.status; throw err; }
    return data;
}
export function getStudents(filters = {}, signal) {
    const params = Object.fromEntries(Object.entries(filters).filter(([key, value]) => value !== '' && value != null));
    return apiRequest('/students?' + new URLSearchParams(params), { signal });
}
export function deleteStudent(id) { return apiRequest('/students/' + id, { method: 'DELETE' }); }
