// iragrom — валидация
// Проверка данных студента перед сохранением
export function validateStudent(student) {
    const errors = {};

    const fullName = String(student.fullName ?? '').trim();
    const group = String(student.group ?? '').trim();
    const notes = String(student.notes ?? '').trim();

    // ФИО: от 2 до 100 символов, только буквы, пробелы и дефисы
    if (
        fullName.length < 2 ||
        fullName.length > 100 ||
        !/^(?=.*\p{L})[\p{L} -]+$/u.test(fullName)
    ) {
        errors.fullName = 'Введите корректное ФИО (от 2 до 100 символов)';
    }

    // Группа: буква и четыре цифры
    if (!/^\p{L}[0-9]{4}$/u.test(group)) {
        errors.group = 'Введите группу в формате P3224';
    }

    // Номер ИСУ
    if (
        !Number.isInteger(Number(student.isuId)) ||
        student.isuId === '' ||
        Number(student.isuId) < 100000 ||
        Number(student.isuId) > 999999
    ) {
        errors.isuId = 'ИСУ должен состоять из шести цифр';
    }

    // Номер общежития
    if (
        student.dormNumber === '' ||
        !Number.isInteger(Number(student.dormNumber)) ||
        Number(student.dormNumber) < 1 ||
        Number(student.dormNumber) > 10
    ) {
        errors.dormNumber = 'Номер общежития должен быть от 1 до 10';
    }

    // Номер комнаты
    if (
        student.roomNumber === '' ||
        !Number.isInteger(Number(student.roomNumber)) ||
        Number(student.roomNumber) < 100 ||
        Number(student.roomNumber) > 999
    ) {
        errors.roomNumber = 'Номер комнаты должен быть от 100 до 999';
    }

    // Дата заселения
    if (!student.settlementDate) {
        errors.settlementDate = 'Укажите дату заселения';
    } else {
        const date = new Date(student.settlementDate + 'T00:00:00');
        const today = new Date();
        const tenYearsAgo = new Date();

        today.setHours(0, 0, 0, 0);
        tenYearsAgo.setHours(0, 0, 0, 0);
        tenYearsAgo.setFullYear(today.getFullYear() - 10);

        const year = date.getFullYear();

        if (
            Number.isNaN(date.getTime()) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(student.settlementDate) ||
            date.getMonth() + 1 !== Number(student.settlementDate.slice(5, 7)) ||
            date.getDate() !== Number(student.settlementDate.slice(8, 10)) ||
            year < 2018 ||
            year > 2035
        ) {
            errors.settlementDate = 'Дата должна быть в диапазоне 2018–2035';
        } else if (date > today) {
            errors.settlementDate = 'Дата заселения не может быть в будущем';
        } else if (date < tenYearsAgo) {
            errors.settlementDate = 'Срок проживания не может превышать 10 лет';
        }
    }

    // Заметки
    if (notes.length > 500) {
        errors.notes = 'Заметки не могут превышать 500 символов';
    } else if (/[\/\\*"<>]/.test(notes)) {
        errors.notes = 'В заметках есть запрещённые символы';
    } else if (notes && notes.split(/\s+/).length > 50) {
        errors.notes = 'Заметки не могут превышать 50 слов';
    }

    return errors;
}
