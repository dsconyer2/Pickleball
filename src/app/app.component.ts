import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { ApplicationStarted } from './actions/app.actions';
import { State } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Pickleball Scheduler';
  isCollapsed = false;

  constructor(store: Store<State>) {
    store.dispatch(new ApplicationStarted());
  }

}
