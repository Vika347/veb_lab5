<!-- iragrom — StudentFilters -->
<script>
    // Фильтры получаем от родительской страницы
    export let filters = {};

    // Функции вызываются при изменении фильтров
    export let onChange = () => {};
    export let onReset = () => {};

    // Показываем или скрываем дополнительные поля
    let showAdvanced = false;

    // Обновление одного фильтра
    function changeFilter(name, value) {
        // Группу приводим к верхнему регистру
        if (name === 'group') {
            value = value.toUpperCase();
        }

        onChange({
            ...filters,
            [name]: value
        });
    }

    // Очистка всех фильтров
    function resetFilters() {
        onReset();
    }
</script>

<section class="filters">

    <!-- Поиск по ФИО всегда виден -->
    <div class="filters__row">
        <div class="filters__field">
            <label for="filter-search">🔍 Поиск по ФИО</label>
            <input
                id="filter-search"
                type="text"
                placeholder="Иванов"
                autocomplete="off"
                value={filters.search ?? ''}
                on:input={(event) =>
                    changeFilter('search', event.currentTarget.value)}
            />
        </div>
    </div>

    <!-- Основные фильтры -->
    <div class="filters__row">
        <div class="filters__field">
            <label for="filter-group">Группа</label>
            <input
                id="filter-group"
                type="text"
                placeholder="P3224"
                autocomplete="off"
                value={filters.group ?? ''}
                on:input={(event) =>
                    changeFilter('group', event.currentTarget.value)}
            />
        </div>

        <div class="filters__field">
            <label for="filter-dorm">Общежитие</label>
            <input
                id="filter-dorm"
                type="number"
                min="1"
                max="10"
                placeholder="3"
                value={filters.dormNumber ?? ''}
                on:input={(event) =>
                    changeFilter('dormNumber', event.currentTarget.value)}
            />
        </div>
    </div>

    <!-- Дополнительные фильтры -->
    {#if showAdvanced}
        <div class="filters__row filters__row--advanced">
            <div class="filters__field">
                <label for="filter-id">ID студента</label>
                <input
                    id="filter-id"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={filters.id ?? ''}
                    on:input={(event) =>
                        changeFilter('id', event.currentTarget.value)}
                />
            </div>

            <div class="filters__field">
                <label for="filter-isu">ИСУ</label>
                <input
                    id="filter-isu"
                    type="number"
                    min="1"
                    max="999999"
                    placeholder="123456"
                    value={filters.isuId ?? ''}
                    on:input={(event) =>
                        changeFilter('isuId', event.currentTarget.value)}
                />
            </div>

            <div class="filters__field">
                <label for="filter-room">Комната</label>
                <input
                    id="filter-room"
                    type="number"
                    min="100"
                    max="999"
                    placeholder="305"
                    value={filters.roomNumber ?? ''}
                    on:input={(event) =>
                        changeFilter('roomNumber', event.currentTarget.value)}
                />
            </div>

            <div class="filters__field">
                <label for="filter-date">Дата заселения</label>
                <input
                    id="filter-date"
                    type="date"
                    value={filters.settlementDate ?? ''}
                    on:change={(event) =>
                        changeFilter('settlementDate', event.currentTarget.value)}
                />
            </div>

            <div class="filters__field">
                <label for="filter-foreigner">Иностранец</label>
                <select
                    id="filter-foreigner"
                    value={filters.isForeigner ?? ''}
                    on:change={(event) =>
                        changeFilter('isForeigner', event.currentTarget.value)}
                >
                    <option value="">Все</option>
                    <option value="true">Только иностранцы</option>
                    <option value="false">Только не иностранцы</option>
                </select>
            </div>

            <div class="filters__field">
                <label for="filter-notes">Заметки</label>
                <input
                    id="filter-notes"
                    type="text"
                    placeholder="Текст заметки"
                    value={filters.notes ?? ''}
                    on:input={(event) =>
                        changeFilter('notes', event.currentTarget.value)}
                />
            </div>
        </div>
    {/if}

    <!-- Сортировка -->
    <div class="filters__row">
        <div class="filters__field">
            <label for="filter-sort">Сортировать по</label>
            <select
                id="filter-sort"
                value={filters.sortBy ?? 'id'}
                on:change={(event) =>
                    changeFilter('sortBy', event.currentTarget.value)}
            >
                <option value="id">ID</option>
                <option value="fullName">ФИО</option>
                <option value="group">Группе</option>
                <option value="isuId">ИСУ</option>
                <option value="dormNumber">Общежитию</option>
                <option value="roomNumber">Комнате</option>
                <option value="settlementDate">Дате заселения</option>
                <option value="isForeigner">Иностранный студент</option>
                <option value="notes">Заметкам</option>
            </select>
        </div>

        <div class="filters__field">
            <label for="filter-order">Порядок</label>
            <select
                id="filter-order"
                value={filters.sortOrder ?? 'asc'}
                on:change={(event) =>
                    changeFilter('sortOrder', event.currentTarget.value)}
            >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>
        </div>
    </div>

    <!-- Кнопки -->
    <div class="filters__actions">
        <button
            type="button"
            class="btn btn--secondary"
            on:click={() => showAdvanced = !showAdvanced}
        >
            {showAdvanced ? '⚙️ Скрыть фильтр' : '⚙️ Расширенный фильтр'}
        </button>

        <button
            type="button"
            class="btn btn--secondary"
            on:click={resetFilters}
        >
            ✖ Сбросить
        </button>
    </div>

</section>
