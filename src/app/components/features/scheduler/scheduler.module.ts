import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ScheduleEntryComponent } from './components/schedule-entry/schedule-entry.component';
import { ScheduleTournamentComponent } from './components/schedule-tournament/schedule-tournament.component';
import { SchedulerEffects } from './store/effects/scheduler.effects';
import { reducers } from './store/reducers';
import { SchedulerComponent } from './scheduler.component';
import { AppStartUpEffects } from './store/effects/app-startup.effects';
import { ValidNbrOfCourtsDirective } from './directives/valid-nbr-of-courts.directive';
import { ScheduleDisplayComponent } from './components/schedule-display/schedule-display.component';
import { HighlightOnHoverDirective } from './directives/highlight-on-hover.directive';
import { MatchLabelPipe } from './pipes/match-label.pipe';
import { AutofocusDirective } from './directives/auto-focus.directive';
import { MatchScorePipe } from './pipes/match-score.pipe';

@NgModule({
  declarations: [
    SchedulerComponent,
    ScheduleEntryComponent,
    ScheduleTournamentComponent,
    ValidNbrOfCourtsDirective,
    HighlightOnHoverDirective,
    AutofocusDirective,
    ScheduleDisplayComponent,
    MatchLabelPipe,
    MatchScorePipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('schedulerFeature', reducers),
    EffectsModule.forFeature([SchedulerEffects, AppStartUpEffects])
  ],
  exports: [SchedulerComponent]
})
export class SchedulerModule { }
