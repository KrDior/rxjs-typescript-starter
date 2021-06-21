import { interval, of, queueScheduler, defer, timer, SchedulerLike, Observable, fromEvent, Observer, range, from, combineLatest, forkJoin, scheduled, asyncScheduler, asapScheduler, animationFrameScheduler, merge, throwError, zip, race } from 'rxjs';
import { delay, switchMap, tap, flatMap, map, repeat, delayWhen, concatMap, take, catchError, filter, mergeMap, takeUntil, first, single, ignoreElements, debounce, debounceTime, distinctUntilChanged, throttle, throttleTime, skip, observeOn, pluck, scan, reduce, mapTo, exhaustMap, retry, retryWhen, timeout, finalize, skipLast, skipUntil, last, takeWhile, concat, startWith, withLatestFrom, pairwise } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

const inputElem = document.querySelector('input');
const o1$ = fromEvent(inputElem, 'input');

//Observable

const o0$ = new Observable((observer: Observer<string>) => {
  observer.next('Hello');
  observer.complete();
});

o0$.subscribe({
  next: result => console.log(result),
  complete: () => console.log('done'),
  error: (err) => console.log(err)
});

// Filtering Operators

// debounce
// wait .5s between keyups to emit current value
o1$
  .pipe(
    map((i: any) => i.currentTarget.value),
    debounceTime(2000),
    debounce((num) => timer(1000 * num)), // callback with value and return Observable
  )
  // .subscribe(console.log);


// timer + throttleTime
// Emit first value then ignore for specified duration
const o2$ = timer(0, 500).pipe(
  throttle((num) => timer(1000 * num)), // callback with value and return Observable
  throttleTime(2000),
)
// .subscribe(console.log);

const o3$ = range(0, 100).pipe(
  filter(num => num > 50),
  first(num => num > 50),
  last(num => num > 50),
  single(num => num == 50), // return value if only one value
  ignoreElements(), // return complited and will ignore all elements
  skip(90),
  skipLast(5),
  skipUntil(timer(1000)), // receive Observable
  takeUntil(timer(1000)),
  takeWhile(num => num < 50), // receive callback
  take(2)
)
// .subscribe(console.log);

//emit value every 1s
const source = interval(1000);
//after 5 seconds, emit value
const timer$ = timer(5000);
//when timer emits after 5s, complete source
const example = source.pipe(takeUntil(timer$));
//output: 0,1,2,3
// example.subscribe(val => console.log(val));

// compare prev and cur value
const o4$ = from([1, 1, 2, 3, 3, 3, 4]).pipe(
  distinctUntilChanged()
)
// .subscribe(console.log);


// Combine Obs

const timerOne = timer(1000, 4000).pipe(take(3));
const timerTwo = timer(2000, 4000).pipe(take(3));
const timerThree = timer(3000, 4000).pipe(take(3));

const o5$ = combineLatest([timerOne, timerTwo, timerThree]); // [0,0,0] [1,0,0] [1,1,0] [1,1,1]
const o6$ = forkJoin([timerOne, timerTwo, timerThree]); // emit all last values [2,2,2]
const o7$ = zip([timerOne, timerTwo, timerThree]); // [0,0,0] [1,1,1] [2,2,2]

const t4 = timer(0, 1000).pipe(take(3));
const t5 = timer(0, 100).pipe(take(3));

const o8$ = t4.pipe(concat(t5)); // 0 1 2 0 1 2
const o9$ = merge(t4, t5); // 0 0 1 2 1 2

t4.pipe(
  startWith(5),
  withLatestFrom(t5), // [0,0] [1,2] [2,2]
  pairwise(), // [0,1] [1,2]
)

const o10$ = race(t4, t5);


// Transform

// get only prop value
const o11$ = scheduled([{
  name: 'Alice',
  age: 33
}], asapScheduler).pipe(
  pluck('name')
);


// reduce scan
const o12$ = from([1, 2, 3, 4, 5]).pipe(
  // scan((acc, cur) => acc + cur) // the same as reduce but emit value for every iteration
  reduce((acc, cur) => acc + cur) // don't use for infinitive stream
);

// map mapTo
const o13$ = range(0, 5).pipe(
  map(n => n * 2),
  mapTo('Hi') // all value will be 'Hi'
);

// flatMap switchMap
const o14$ = fromEvent(document, 'click').pipe(
  flatMap(_ => interval(1000)), // high order observable
  concatMap(_ => interval(1000)), // high order observable with order
  switchMap(_ => interval(1000)), // stop prev stream
  exhaustMap(_ => interval(1000)), // take one time
);

// v^v delay
export const createSpecialInterval = (number: number, scheduler ?: SchedulerLike ) => {
  return interval(0, scheduler).pipe(
    concatMap(v => of(v).pipe(
      delay(v * 1000, scheduler)
    )
  ),
  take(number));
}
// createSpecialInterval(5).subscribe(v => {
//   console.log(v);
//   console.timeEnd('interval');
//   console.time('interval');
// });

// switchMap
o1$.pipe(
  switchMap((event: KeyboardEvent) => {
    return fetch(`https://api.github.com/search/repositories?q=${(event.target as HTMLInputElement).value}`)
      .then(response => response.json());
  })
)
// .subscribe((res: any) => {
//   console.log(res.total_count)
// });


// Error handling

const o16$ = interval(1000).pipe(
  mergeMap(val => {
    if(val > 3) {
      return throwError('Error > 3');
    }
    return of(val);
  }),
  catchError((err) => {
    console.log(err);
    return of(false);
  }),
  retry(2),
  retryWhen(errObservable => errObservable.pipe(delay(3000)))
);

// tap
const o17$ = range(0, 10).pipe(
  tap(n => {
    // sideEffect without mutation
  }),
  finalize(() => {
    console.log('Finish')
  })
);

// o17$.toPromise().then()



// // Scheduler https://habr.com/ru/post/529000/

// // console.log("Start");

// // scheduled([1, 2, 3], asyncScheduler)
// //   .subscribe(console.log);

// // console.log("End");

// const async$ = scheduled(["asyncScheduler"], asyncScheduler);
// const asap$ = scheduled(["asapScheduler"], asapScheduler);
// const queue$ = scheduled(["queueScheduler"], queueScheduler);
// const animationFrame$ = scheduled(["animationFrameScheduler"], animationFrameScheduler);
// // merge(async$, asap$, queue$, animationFrame$).subscribe(console.log);

// console.log("synchronous code");

// // Logs:
// // queueScheduler
// // synchronous code
// // asapScheduler
// // animationFrameScheduler
// // asyncScheduler
