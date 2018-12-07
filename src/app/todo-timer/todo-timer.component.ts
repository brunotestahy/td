import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  public isStopped = false;
  private MAX_TIME =  1200; // 30 minutes in seconds
  borderD = '';
  loaderD = '';

  constructor() {
  }

  ngOnInit() {
    this.buildTimer();
  }

  public toggleExecution() {
    this.isStopped = !this.isStopped;
    this.start$.next(this.isStopped);
  }

  private buildTimer(): void {
    concat(this.start$, this.stop$)
      .pipe(
        switchMap(stopped => (stopped ? NEVER : timer(0, 100))),
        scan(acc => acc - 1, this.MAX_TIME),
      )
      .subscribe(this.updateLoader.bind(this));

    this.start$.next(this.isStopped);
  }

  private updateLoader(currentValue: number) {
    currentValue = this.MAX_TIME - currentValue;
    const PI = Math.PI;
    const totalSections = 360;
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

    this.checkMaxTime(currentValue);
  }

  private checkMaxTime(seconds: number) {
    if (seconds === this.MAX_TIME - 1) {
      this.toggleExecution();
    }
  }
}
