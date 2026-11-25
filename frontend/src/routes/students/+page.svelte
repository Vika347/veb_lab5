<!-- iragrom — список студентов -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { notifyStudents } from '$lib/studentChannel.js';

    import StudentTable from '$lib/components/StudentTable.svelte';
    import StudentFilters from '$lib/components/StudentFilters.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    import { deleteStudent } from '$lib/services/studentsApi.js';
    import { createStudentSearch } from '$lib/rxjs/studentSearch.js';

    // Роль пользователя передаёт общий layout
    export let data;
    $: isAdmin = data.user?.role === 'ADMIN';

    // Функция перехода на другую страницу
    const navigate = goto;

    // Данные студентов
    let students = data.students;
    let hasNext = data.hasNext;

    // Состояние страницы
    let loading = false;
    let deleting = false;
    let error = '';

    // Настройки пагинации
    let page = 1;
    let size = 10;

    // Фильтры и сортировка
    let filters = {
        search: '',
        group: '',
        dormNumber: '',
        sortBy: 'id',
        sortOrder: 'asc'
    };

    // Экземпляр реактивного поиска
    let studentSearch;

    // Формируем параметры запроса
    function getParams() {
        return {
            ...filters,
            page,
            size
        };
    }

    // Обновляем список через RxJS
    function loadStudents() {
        loading = true;
        error = '';

        studentSearch?.search(getParams());
    }

    // Обработка результата поиска
    function handleResult(result) {
        loading = false;

        if (result.error) {
            error = result.error.message || 'Не удалось загрузить студентов';
            students = [];
            hasNext = false;
            return;
        }

        students = result.students || [];
        hasNext = result.hasNext;
        if (!students.length && page > 1) { page--; loadStudents(); }
    }

    // Изменение фильтров
    function changeFilters(newFilters) {
        filters = newFilters;

        // При изменении фильтров возвращаемся на первую страницу
        page = 1;
        loadStudents();
    }

    // Сброс фильтров
    function resetFilters() {
        filters = {
            search: '',
            group: '',
            dormNumber: '',
            sortBy: 'id',
            sortOrder: 'asc'
        };

        page = 1;
        loadStudents();
    }

    // Переход на другую страницу
    function changePage(newPage) {
        page = newPage;
        loadStudents();
    }

    // Изменение количества записей на странице
    function changeSize(newSize) {
        size = newSize;
        page = 1;
        loadStudents();
    }

    // Просмотр информации о студенте
    function viewStudent(id) {
        navigate(`/students/${id}`);
    }

    // Редактирование студента
    function editStudent(id) {
        if (isAdmin) {
            navigate(`/students/${id}/edit`);
        }
    }

    // Добавление студента
    function addStudent() {
        if (isAdmin) {
            navigate('/students/new');
        }
    }

    // Удаление студента
    async function removeStudent(id) {
        if (!isAdmin || deleting) return;

        deleting = true;
        error = '';

        try {
            await deleteStudent(id);
            notifyStudents('delete', id);
            if (students.length === 1 && page > 1) page--;

            // После удаления обновляем список
            loadStudents();

        } catch (err) {
            error = err.message || 'Не удалось удалить студента';

        } finally {
            deleting = false;
        }
    }

    // При открытии страницы подключаем RxJS
    onMount(() => {
        studentSearch = createStudentSearch(handleResult);

        // SSR уже загрузил первую страницу
        const channel = new BroadcastChannel('students');
        channel.onmessage = () => loadStudents();

        // При закрытии страницы удаляем подписку
        return () => {
            studentSearch.destroy();
            channel.close();
        };
    });
</script>

<!-- Заголовок страницы -->
<div class="view__header">
    <h1>📋 Список студентов</h1>

    {#if isAdmin}
        <button
            type="button"
            class="btn btn--primary"
            on:click={addStudent}
        >
            ➕ Добавить студента
        </button>
    {/if}
</div>

<!-- Фильтры и поиск -->
<StudentFilters
    {filters}
    onChange={changeFilters}
    onReset={resetFilters}
/>

<!-- Ошибки сервера -->
{#if error}
    <div class="error-message" role="alert">
        {error}
    </div>
{/if}

<!-- Загрузка -->
{#if loading || deleting}
    <LoadingSpinner
        message={deleting ? 'Удаление студента...' : 'Загрузка студентов...'}
    />
{/if}

<!-- Результаты -->
{#if !loading}
    {#if students.length > 0}
        <div class="filters__summary">
            Показано студентов: {students.length}
        </div>

        <StudentTable
            {students}
            {isAdmin}
            onView={viewStudent}
            onEdit={editStudent}
            onDelete={removeStudent}
        />

    {:else if !error}
        <div class="empty-state">
            <p>😺 Студенты не найдены</p>
        </div>
    {/if}

    <!-- Пагинация -->
    {#if !error}
        <Pagination
            {page}
            {size}
            count={students.length}
            {hasNext}
            loading={loading || deleting}
            onPageChange={changePage}
            onSizeChange={changeSize}
        />
    {/if}
{/if}
