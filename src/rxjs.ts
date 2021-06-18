import { asyncScheduler, BehaviorSubject, fromEvent, interval, Observable, Observer, of, ReplaySubject, scheduled, Subject } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { take } from "rxjs/internal/operators/take";
import { debounce, debounceTime, filter, mergeMap, switchMap } from "rxjs/operators";


// 1 Create simple observable
const o1$ = new Observable((observer: Observer<Number>) => {
  observer.next(1);
	observer.next(2);
	observer.next(3);
  observer.complete();
});

// o1$.subscribe(
// 	value => console.log(value),
// 	error => {},
// 	() => console.log('Observable is completed!')
// );

// 2 Subject, BehaviorSubject, ReplaySubject
const subject1$ = new ReplaySubject(3);

// subject1$.subscribe(x => console.log('first subject subscribe', x));
subject1$.next(1);
subject1$.next(2);
// subject1$.complete();
// subject1$.unsubscribe();
// subject1$.subscribe(x => console.log('second subject subscribe', x));
subject1$.next(3);

// 3 Interval, map, filter
const o2$ = interval(1000).pipe(
	// take(5)
);

// o2$.pipe(
// 	map(x => x * 3),
// 	filter(x => x%2 === 0)
// ).subscribe(x => console.log(x));


// 4 MergeMap

const o3$ = interval();
const o4$ = scheduled(['a', 'b', 'c', 'd', 'e'], asyncScheduler);

// o4$.pipe(
// 	mergeMap(x =>
// 		o3$.pipe(
// 			take(5),
// 			map(i => i + x)
// 		)
// 	)
// ).subscribe(val => console.log(val));


// 5 switchMap

// o4$.pipe(
// 	switchMap(x =>
// 		o3$.pipe(
// 			take(5),
// 			map(i => i + x)
// 		)
// 	)
// ).subscribe(val => console.log(val));


// 6 Event from Btn click

const btn = document.querySelector('.btn');
const observableBtn$ = fromEvent(btn, 'click');

// observableBtn$.subscribe(x => console.log(x));

// 7 Input + debounceTime

const inputElem = document.querySelector('input');
const observableInp$ = fromEvent(inputElem, 'input');
const searchSubject = new Subject<string>();

observableInp$
.pipe(
	debounceTime(1000)
)
.subscribe(e => console.log((e.target as HTMLInputElement).value))
