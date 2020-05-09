import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Player, SchedulerSettings } from './models/index';
import { SchedulerState, selectPlayerEntities, selectSchedulerSettings } from './store/reducers';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {

  players$: Observable<Player[]>;
  schedulerSettings$: Observable<SchedulerSettings>;

  constructor(private store: Store<SchedulerState>) { }

  ngOnInit() {
    this.players$ = this.store.select(selectPlayerEntities);
    this.schedulerSettings$ = this.store.select(selectSchedulerSettings);
  }

}
