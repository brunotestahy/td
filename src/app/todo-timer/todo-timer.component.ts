import { Component, OnInit } from '@angular/core';
import { concat, NEVER, Subject, timer } from 'rxjs';
import { scan, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent implements OnInit {
  private start$ = new Subject();
  private stop$ = new Subject();

  constructor() { }

  ngOnInit() {
    this.buildTimer();
  }

  public play() {
    this.start$.next(false);
  }

  public pause() {
    this.start$.next(true);
  }

  private buildTimer(): void {
    concat(this.start$, this.stop$)
      .pipe(
        switchMap(stopped => (stopped ? NEVER : timer(0, 1000))),
        scan(acc => acc + 1, 0),
      )
      .subscribe(console.log);

    this.start$.next(false);
  }
}
