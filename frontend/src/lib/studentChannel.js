// iragrom — обновление данных в других вкладках
export function notifyStudents(type, id) {
    const channel = new BroadcastChannel('students');
    channel.postMessage({ type, id });
    channel.close();
}
