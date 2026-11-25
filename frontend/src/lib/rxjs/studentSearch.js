// iragrom — реактивный поиск с отменой запроса
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { getStudents } from '../services/studentsApi.js';
export function createStudentSearch(onResult) {
    const filters$ = new Subject();
    const subscription = filters$.pipe(
        debounceTime(400),
        switchMap(filters => new Observable(subscriber => {
            const controller = new AbortController();
            getStudents(filters, controller.signal).then(result => {
                subscriber.next(result);
                subscriber.complete();
            }).catch(error => subscriber.error(error));
            return () => controller.abort();
        }).pipe(
            // Отменяем старый запрос сразу при новом вводе.
            takeUntil(filters$),
            map(result => ({ ...result, error: null })),
            catchError(error => of({ students: [], hasNext: false, error }))
        ))
    ).subscribe(onResult);
    return {
        search(filters) { filters$.next({ ...filters }); },
        destroy() { subscription.unsubscribe(); filters$.complete(); }
    };
}
