<!-- iragrom — Pagination -->
<script>
    // Текущая страница и количество записей
    export let page = 1;
    export let size = 10;

    // Количество студентов на загруженной странице
    export let count = 0;
    export let hasNext = false;

    // Идёт ли загрузка
    export let loading = false;

    // Функции изменения страницы и размера
    export let onPageChange = () => {};
    export let onSizeChange = () => {};

    // Переход к предыдущей странице
    function previousPage() {
        if (page > 1 && !loading) {
            onPageChange(page - 1);
        }
    }

    // Переход к следующей странице
    function nextPage() {
        if (count > 0 && hasNext && !loading) {
            onPageChange(page + 1);
        }
    }

    // Изменение количества студентов на странице
    function changeSize(event) {
        const newSize = Number(event.currentTarget.value);
        onSizeChange(newSize);
    }
</script>

<div class="pagination">

    <div class="pagination__info">
        Страница {page}
    </div>

    <div class="pagination__buttons">
        <button
            type="button"
            class="btn btn--secondary btn--small"
            disabled={page <= 1 || loading}
            on:click={previousPage}
        >
            ← Назад
        </button>

        <button
            type="button"
            class="btn btn--secondary btn--small"
            disabled={!hasNext || loading}
            on:click={nextPage}
        >
            Вперёд →
        </button>
    </div>

    <div class="pagination__size">
        <label for="page-size">Показывать:</label>

        <select
            id="page-size"
            value={size}
            disabled={loading}
            on:change={changeSize}
        >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
    </div>

</div>


