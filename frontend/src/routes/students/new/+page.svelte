<!-- iragrom — форма студента -->
<script>
    import StudentForm from '$lib/components/StudentForm.svelte';
    export let data;
    export let form;
</script>
<StudentForm studentId={null} initialStudent={null} isAdmin={data.user?.role === 'ADMIN'} {form} />
