<!-- iragrom — досье студента -->
<script>
    import { onMount } from 'svelte';
    import { goto as navigate, invalidate } from '$app/navigation';
    import { deleteStudent } from '$lib/services/studentsApi.js';
    import { notifyStudents } from '$lib/studentChannel.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
    export let data;
    $: student = data.student;
    $: studentId = student.id;
    $: isAdmin = data.user?.role === 'ADMIN';
    let loading = false;
    let error = '';
    async function removeStudent() {
        if (!confirm(`Удалить студента ${student.fullName}?`)) return;
        try { await deleteStudent(studentId); notifyStudents('delete', studentId); await navigate('/students', { invalidateAll: true }); }
        catch (err) { error = err.message; }
    }
    onMount(() => {
        const channel = new BroadcastChannel('students');
        channel.onmessage = ({ data }) => {
            if (String(data.id) !== String(studentId)) return;
            if (data.type === 'delete') { alert('Студент удалён'); navigate('/students', { invalidateAll: true }); }
            else invalidate('app:student');
        };
        return () => channel.close();
    });
</script>
<div class="view__header">
    <h1>📄 Досье студента</h1>

    <button
        type="button"
        class="btn btn--secondary"
        on:click={() => navigate('/students')}
    >
        ← Назад к списку
    </button>
</div>

{#if loading}
    <LoadingSpinner message="Загрузка данных студента..." />

{:else if error}
    <div class="error-message" role="alert">
        {error}
    </div>

{:else if student}
    <div class="profile-card">
        <p>
            <span class="label">ФИО:</span>
            <span class="value">{student.fullName}</span>
        </p>

        <p>
            <span class="label">Группа:</span>
            <span class="value">{student.group}</span>
        </p>

        <p>
            <span class="label">ИСУ ID:</span>
            <span class="value">{student.isuId}</span>
        </p>

        <p>
            <span class="label">Общежитие:</span>
            <span class="value">{student.dormNumber}</span>
        </p>

        <p>
            <span class="label">Комната:</span>
            <span class="value">{student.roomNumber}</span>
        </p>

        <p>
            <span class="label">Дата заселения:</span>
            <span class="value">{student.settlementDate}</span>
        </p>

        <p>
            <span class="label">Иностранец:</span>
            <span class="value">
                {student.isForeigner ? 'Да' : 'Нет'}
            </span>
        </p>

        <p>
            <span class="label">Заметки:</span>
            <span class="value">{student.notes || 'Нет заметок'}</span>
        </p>
    </div>

    {#if isAdmin}
        <div class="form-actions">
            <button
                type="button"
                class="btn btn--primary"
                on:click={() => navigate(`/students/${studentId}/edit`)}
            >
                ✏️ Изменить
            </button>
        <button class="btn btn--danger" on:click={removeStudent}>Удалить</button>
        </div>
    {/if}
{/if}
