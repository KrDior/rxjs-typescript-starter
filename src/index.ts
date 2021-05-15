import { interval, of, queueScheduler, defer, timer, SchedulerLike, Observable, fromEvent, Observer, range, from, combineLatest, forkJoin, scheduled, asyncScheduler, asapScheduler, animationFrameScheduler, merge, throwError } from 'rxjs';
import { delay, switchMap, tap, flatMap, map, repeat, delayWhen, concatMap, take, catchError, filter, mergeMap, takeUntil, first, single, ignoreElements, debounce, debounceTime, distinctUntilChanged, throttle, throttleTime, skip, observeOn, pluck, scan, reduce, mapTo, exhaustMap, retry, retryWhen, timeout, finalize } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

// v^v delay
// export const createSpecialInterval = (number: number, scheduler ?: SchedulerLike ) => {
//   return interval(0, scheduler).pipe(concatMap(v => of(v).pipe(delay(v * 1000, scheduler))), take(number));
// }

// createSpecialInterval(100).subscribe(v => {
//   console.log(v);
//   console.timeEnd('interval');
//   console.time('interval');
// });

const inputElem = document.querySelector('input');
const observable = fromEvent(inputElem, 'input');

// switchMap
observable.pipe(
  switchMap((event: KeyboardEvent) => {
    return fetch(`https://api.github.com/search/repositories?q=${(event.target as HTMLInputElement).value}`)
      .then(response => response.json());
  })
).subscribe((res: any) => {
  console.log(res.total_count)
});


//Observable

const o1$ = new Observable((observer: Observer<string>) => {
  observer.next('Hello');
  observer.complete();
});

// timer
const o2$ = timer(0, 500).pipe(
  throttleTime(1000)
);

// range
const o3$ = range(0, 100).pipe(
  // filter(num => num > 50)
  // first(num => num > 50)
  // last(num => num > 50)
  // single(num => num == 50)
  // ignoreElements()
  // debounce(() => timer(1000))
  // debounceTime(1000)
  skip(90),
  take(2)
);

const o4$ = from([1, 1, 2, 3, 3, 3, 4]).pipe(
  distinctUntilChanged()
);

const timerOne = timer(10, 1000).pipe(take(3));
const timerTwo = timer(10, 1000).pipe(take(3));
const timerThree = timer(10, 1000).pipe(take(3));

const o5$ = combineLatest([timerOne, timerTwo, timerThree]);
// const o5$ = forkJoin([timerOne, timerTwo, timerThree]);

const t4 = timer(0, 2000).pipe(take(3));
const t5 = timer(0, 100).pipe(take(3));

const o6$ = merge(t4, t5);

// Scheduler https://habr.com/ru/post/529000/

// console.log("Start");

// scheduled([1, 2, 3], asyncScheduler)
//   .subscribe(console.log);

// console.log("End");

const async$ = scheduled(["asyncScheduler"], asyncScheduler);
const asap$ = scheduled(["asapScheduler"], asapScheduler);
const queue$ = scheduled(["queueScheduler"], queueScheduler);
const animationFrame$ = scheduled(["animationFrameScheduler"], animationFrameScheduler);
// merge(async$, asap$, queue$, animationFrame$).subscribe(console.log);

console.log("synchronous code");

// Logs:
// queueScheduler
// synchronous code
// asapScheduler
// animationFrameScheduler
// asyncScheduler

const o7$ = scheduled([{
  name: 'Alice',
  age: 33
}], asapScheduler).pipe(
  pluck('name')
);


// reduce scan
const o8$ = from([1, 2, 3, 4, 5]).pipe(
  // scan((acc, cur) => acc + cur)
  reduce((acc, cur) => acc + cur)
);

// map mapTo
const o9$ = range(0, 5).pipe(
  // map(n => n * 2)
  // mapTo('Hi')
);

// flatMap switchMap
const o10$ = fromEvent(document, 'click').pipe(
  // flatMap(_ => interval(1000))
  // switchMap(_ => interval(1000))
  exhaustMap(_ => interval(1000))
);


// Error handling

const o11$ = interval(1000).pipe(
  mergeMap(val => {
    if(val > 3) {
      return throwError('Error > 3');
    }
    return of(val);
  }),
  // catchError((err) => {
  //   console.log(err);
  //   return of(false);
  // })
  // retry(2)
  retryWhen(errObservable => errObservable.pipe(delay(3000)))
);

// tap
const o12$ = range(0, 10).pipe(
  tap(n => {
    // sideEffect without mutation
  }),
  finalize(() => {
    console.log('Finish')
  })
);

// o12$.toPromise().then()

o12$.subscribe({
  next: result => console.log(result),
  complete: () => console.log('done'),
  error: (err) => console.log(err)
});
