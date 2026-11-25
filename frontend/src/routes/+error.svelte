<!-- iragrom — общая страница ошибок -->
<script>import { page } from '$app/stores';</script>
<h1>Ошибка {$page.status}</h1><p>{$page.error?.message}</p><a class="btn" href="/students">К списку студентов</a>
