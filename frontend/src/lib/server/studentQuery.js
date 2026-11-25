// iragrom — подготовка запроса с фильтрами
export function cleanParams(filters) {
    const params = {};
    for (const key in filters) {
        const value = filters[key];
        if (value !== '' && value !== null && value !== undefined) params[key] = value;
    }
    return params;
}
export function buildStudentsRequest(filters = {}) {
    const params = cleanParams(filters);
    const controlFields = ['sortBy', 'sortOrder', 'page', 'size'];
    const filterCount = Object.keys(params).filter(key => !controlFields.includes(key)).length;
    if (filterCount <= 2) {
        const query = new URLSearchParams(params).toString();
        return { path: query ? '/students?' + query : '/students', options: { method: 'GET' } };
    }
    return { path: '/students', options: { method: 'QUERY', body: JSON.stringify(params) } };
}
