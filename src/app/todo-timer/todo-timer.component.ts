import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { concat, NEVER, Subject, timer } from 'rxjs';
import { scan, switchMap } from 'rxjs/operators';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent implements OnInit {
  private start$ = new Subject();
  private stop$ = new Subject();
  public isStopped = false;
  private MAX_TIME =  1200; // 30 minutes in seconds
  public borderD = '';
  public loaderD = '';
  public timeSpent = 0;

  @Output()
  updateTimeSpent: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.buildTimer();
  }

  public toggleExecution() {
    if (!this.isStopped) {
      this.updateTimeSpent.emit(this.timeSpent);
    }
    this.isStopped = !this.isStopped;
    this.start$.next(this.isStopped);
  }

  private buildTimer(): void {
    concat(this.start$, this.stop$)
      .pipe(
        switchMap(stopped => (stopped ? NEVER : timer(0, 1000))),
        scan(acc => acc - 1, this.MAX_TIME),
      )
      .subscribe(this.updateLoader.bind(this));

    this.start$.next(this.isStopped);
  }

  private updateLoader(currentValue: number) {
    currentValue = this.MAX_TIME - currentValue;
    this.timeSpent = Math.round(currentValue / 60); // in Minutes
    const PI = Math.PI;
    const totalSections = this.MAX_TIME;
    const semiSections = totalSections / 2;

    console.log(currentValue);
    currentValue %= totalSections;
    const r = (currentValue * PI / semiSections);
    const x = Math.sin(r) * 125;
    const y = Math.cos(r) * - 125;
    const mid = (currentValue > semiSections) ? 1 : 0;
    const anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';

    if (r === 0) {
      this.toggleExecution();
      return;
    }

    this.borderD = anim;
    this.loaderD = anim;
  }
}
