<!-- iragrom — StudentTable -->
<script>
    // Массив студентов, полученный от backend
    export let students = [];

    // Роль текущего пользователя
    export let isAdmin = false;

    // Функции для кнопок
    export let onView = () => {};
    export let onEdit = () => {};
    export let onDelete = () => {};

    // Показываем подтверждение перед удалением
    function confirmDelete(student) {
        const confirmed = confirm(
            `Удалить студента ${student.fullName}?`
        );

        if (confirmed) {
            onDelete(student.id);
        }
    }
</script>

<div class="table-wrapper">
    <table class="student-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Группа</th>
                <th>ИСУ</th>
                <th>Общ.</th>
                <th>Комната</th>
                <th>Иностр.</th>
                <th>Действия</th>
            </tr>
        </thead>

        <tbody>
            {#each students as student (student.id)}
                <tr>
                    <td>{student.id}</td>
                    <td>{student.fullName}</td>
                    <td>{student.group}</td>
                    <td>{student.isuId}</td>
                    <td>{student.dormNumber}</td>
                    <td>{student.roomNumber}</td>
                    <td>{student.isForeigner ? 'Да' : 'Нет'}</td>

                    <td>
                        <div class="actions">
                            <button
                                type="button"
                                class="btn btn--small"
                                on:click={() => onView(student.id)}
                            >
                                Посмотреть
                            </button>

                            {#if isAdmin}
                                <button
                                    type="button"
                                    class="btn btn--small"
                                    on:click={() => onEdit(student.id)}
                                >
                                    Изменить
                                </button>

                                <button
                                    type="button"
                                    class="btn btn--danger btn--small"
                                    on:click={() => confirmDelete(student)}
                                >
                                    Удалить
                                </button>
                            {/if}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
