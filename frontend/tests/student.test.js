// iragrom — простые тесты фильтрации и валидации
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudentsRequest } from '../src/lib/server/studentQuery.js';
import { validateStudent } from '../src/lib/utils/validation.js';
const student = { fullName: 'Иванов Иван', group: 'P3224', isuId: 123456, dormNumber: 3, roomNumber: 305, settlementDate: new Date().toISOString().slice(0, 10), isForeigner: false, notes: '' };
test('Параметры управления не считаются фильтрами', () => {
    const { options } = buildStudentsRequest({ page: 1, size: 10, sortBy: 'id', sortOrder: 'asc' });
    assert.equal(options.method, 'GET');
});
test('Два фильтра передаются через GET', () => {
    const { path, options } = buildStudentsRequest({ search: 'Иванов', isForeigner: false, notes: '' });
    assert.equal(options.method, 'GET');
    const params = new URLSearchParams(path.split('?')[1]);
    assert.equal(params.get('search'), 'Иванов');
    assert.equal(params.get('isForeigner'), 'false');
    assert.equal(params.has('notes'), false);
});
test('Три фильтра передаются через QUERY с JSON', () => {
    const { path, options } = buildStudentsRequest({ search: 'Иванов', group: 'P3224', dormNumber: 3, page: 2 });
    assert.equal(path, '/students');
    assert.equal(options.method, 'QUERY');
    assert.deepEqual(JSON.parse(options.body), { search: 'Иванов', group: 'P3224', dormNumber: 3, page: 2 });
});
test('Валидный студент', () => assert.deepEqual(validateStudent(student), {}));
test('Некорректные поля студента', () => {
    const errors = validateStudent({ ...student, fullName: '123', group: 'XYZ', isuId: 12, dormNumber: 11, roomNumber: 2, notes: '<>' });
    for (const field of ['fullName', 'group', 'isuId', 'dormNumber', 'roomNumber', 'notes']) assert.ok(errors[field]);
});
test('Некорректная дата', () => assert.ok(validateStudent({ ...student, settlementDate: '2024-02-31' }).settlementDate));
test('Пустые числовые поля', () => {
    const errors = validateStudent({ ...student, isuId: undefined, dormNumber: '', roomNumber: '' });
    assert.ok(errors.isuId && errors.dormNumber && errors.roomNumber);
});
