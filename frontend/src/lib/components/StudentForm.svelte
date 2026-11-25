<!-- iragrom — форма, клиентская валидация -->
<script>
    import { enhance } from '$app/forms';
    import { goto as navigate } from '$app/navigation';
    import { validateStudent } from '../utils/validation.js';
    import { notifyStudents } from '../studentChannel.js';
    import LoadingSpinner from './LoadingSpinner.svelte';
    export let studentId = null;
    export let initialStudent = null;
    export let isAdmin = false;
    export let form;
    let loading = false;
    let saving = false;
    let error = '';
    let errors = {};
    function emptyStudent() { return { fullName:'', group:'', isuId:'', dormNumber:'', roomNumber:'', settlementDate:'', isForeigner:false, notes:'' }; }
    let student = { ...emptyStudent(), ...(initialStudent || {}), ...(form?.student || {}) };
    student.notes = student.notes ?? '';
    $: if (form) { errors = form.errors || {}; error = form.error || ''; }
    function resetForm() { student = emptyStudent(); errors = {}; error = ''; }
    function saveStudent({ cancel }) {
        errors = validateStudent(student);
        if (!isAdmin || Object.keys(errors).length) { cancel(); return; }
        saving = true;
        return async ({ result, update }) => {
            if (result.type === 'redirect') notifyStudents(studentId === null ? 'create' : 'update', studentId);
            await update({ reset: false });
            saving = false;
        };
    }
</script>
<div class="view__header">
    <h1>
        {studentId === null
            ? '✏️ Добавление студента'
            : '✏️ Редактирование студента'}
    </h1>

    <button
        type="button"
        class="btn btn--secondary"
        on:click={() => navigate('/students')}
    >
        ← Назад к списку
    </button>
</div>

{#if !isAdmin}
    <div class="error-message" role="alert">
        Недостаточно прав для изменения студентов
    </div>

{:else if loading}
    <LoadingSpinner message="Загрузка данных студента..." />

{:else}
    {#if error}
        <div class="error-message" role="alert">
            {error}
        </div>
    {/if}

    <form
        id="student-form"
        novalidate
        autocomplete="off"
        method="POST"
        use:enhance={saveStudent}
    >
        <div class="form-grid">

            <!-- ФИО -->
            <div class="form-group form-group--full">
                <label for="form-fullname">
                    ФИО студента <span class="required">*</span>
                </label>

                <input
                    id="form-fullname"
                    type="text"
                    placeholder="Иванов Иван Иванович"
                    minlength="2"
                    maxlength="100"
                    required
                    name="fullName" bind:value={student.fullName}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.fullName || ''}
                </span>
            </div>

            <!-- Группа -->
            <div class="form-group">
                <label for="form-group">
                    Группа <span class="required">*</span>
                </label>

                <input
                    id="form-group"
                    type="text"
                    placeholder="P3224"
                    maxlength="5"
                    required
                    name="group" bind:value={student.group}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.group || ''}
                </span>
            </div>

            <!-- ИСУ -->
            <div class="form-group">
                <label for="form-isuid">
                    ИСУ ID <span class="required">*</span>
                </label>

                <input
                    id="form-isuid"
                    type="number"
                    placeholder="123456"
                    min="100000"
                    max="999999"
                    step="1"
                    required
                    name="isuId" bind:value={student.isuId}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.isuId || ''}
                </span>
            </div>

            <!-- Общежитие -->
            <div class="form-group">
                <label for="form-dorm">
                    Общежитие <span class="required">*</span>
                </label>

                <input
                    id="form-dorm"
                    type="number"
                    placeholder="3"
                    min="1"
                    max="10"
                    step="1"
                    required
                    name="dormNumber" bind:value={student.dormNumber}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.dormNumber || ''}
                </span>
            </div>

            <!-- Комната -->
            <div class="form-group">
                <label for="form-room">
                    Комната <span class="required">*</span>
                </label>

                <input
                    id="form-room"
                    type="number"
                    placeholder="101"
                    min="100"
                    max="999"
                    step="1"
                    required
                    name="roomNumber" bind:value={student.roomNumber}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.roomNumber || ''}
                </span>
            </div>

            <!-- Дата заселения -->
            <div class="form-group">
                <label for="form-movein">
                    Срок заселения <span class="required">*</span>
                </label>

                <input
                    id="form-movein"
                    type="date"
                    min="2018-01-01"
                    max="2035-12-31"
                    required
                    name="settlementDate" bind:value={student.settlementDate}
                    disabled={saving}
                />

                <span class="form-error">
                    {errors.settlementDate || ''}
                </span>
            </div>

            <!-- Иностранный студент -->
            <div class="form-group form-group--checkbox">
                <label for="form-foreigner">
                    Иностранец
                </label>

                <input
                    id="form-foreigner"
                    type="checkbox"
                    name="isForeigner" bind:checked={student.isForeigner}
                    disabled={saving}
                />
            </div>

            <!-- Заметки -->
            <div class="form-group form-group--full">
                <label for="form-notes">
                    Заметки
                </label>

                <textarea
                    id="form-notes"
                    rows="3"
                    maxlength="500"
                    placeholder="Дополнительная информация..."
                    name="notes" bind:value={student.notes}
                    disabled={saving}
                ></textarea>

                <span class="form-error">
                    {errors.notes || ''}
                </span>
            </div>

        </div>

        <!-- Кнопки формы -->
        <div class="form-actions">
            <button
                type="submit"
                class="btn btn--success"
                disabled={saving}
            >
                {saving ? '⏳ Сохранение...' : '💾 Сохранить'}
            </button>

            <button
                type="button"
                class="btn btn--secondary"
                disabled={saving}
                on:click={resetForm}
            >
                ↺ Очистить
            </button>
        </div>
    </form>
{/if}
