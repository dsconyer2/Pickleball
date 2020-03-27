import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ScheduleEntryComponent } from './components/schedule-entry/schedule-entry.component';
import { ScheduleTournamentComponent } from './components/schedule-tournament/schedule-tournament.component';
import { SchedulerEffects } from './effects/scheduler.effects';
import { reducers } from './reducers';
import { SchedulerComponent } from './scheduler.component';
import { AppStartUpEffects } from './effects/app-startup.effects';
import { ValidNbrOfCourtsDirective } from './directives/valid-nbr-of-courts.directive';

@NgModule({
  declarations: [SchedulerComponent, ScheduleEntryComponent, ScheduleTournamentComponent, ValidNbrOfCourtsDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forFeature('schedulerFeature', reducers),
    EffectsModule.forFeature([SchedulerEffects, AppStartUpEffects])
  ],
  exports: [SchedulerComponent]
})
export class SchedulerModule { }
