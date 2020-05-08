import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupManagerComponent } from './components/features/player-contact/components/group-manager/group-manager.component';
import {
  GroupPlayerManagerComponent,
} from './components/features/player-contact/components/group-player-manager/group-player-manager.component';
import { PlayerContactComponent } from './components/features/player-contact/player-contact.component';
import { ScheduleDisplayComponent } from './components/features/scheduler/components/schedule-display/schedule-display.component';
import { ScheduleEntryComponent } from './components/features/scheduler/components/schedule-entry/schedule-entry.component';
import { ScheduleTournamentComponent } from './components/features/scheduler/components/schedule-tournament/schedule-tournament.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'scheduler',
    component: ScheduleEntryComponent,
  },
  {
    path: 'scheduleTournament',
    component: ScheduleTournamentComponent,
  },
  {
    path: 'scheduleDisplay',
    component: ScheduleDisplayComponent,
  },
  {
    path: 'playerContact',
    component: PlayerContactComponent,
  },
  {
    path: 'groupManager',
    component: GroupManagerComponent,
  },
  {
    path: 'groupPlayerManager',
    component: GroupPlayerManagerComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
