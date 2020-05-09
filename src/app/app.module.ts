import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupManagerDataService } from './components/features/player-contact/dataServices/groupManagerDataService';
import { GroupPlayerDataService } from './components/features/player-contact/dataServices/groupPlayerDataService';
import { GroupPlayerSettingsDataService } from './components/features/player-contact/dataServices/groupPlayerSettingsDataService';
import { PlayerContactDataService } from './components/features/player-contact/dataServices/playerContactDataService';
import { PlayerContactModule } from './components/features/player-contact/player-contact.module';
import { SchedulerDataService } from './components/features/scheduler/data-services/SchedulerDataService';
import { MatchLabelPipe } from './components/features/scheduler/pipes/match-label.pipe';
import { MatchScorePipe } from './components/features/scheduler/pipes/match-score.pipe';
import { SchedulerModule } from './components/features/scheduler/scheduler.module';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { reducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    HomeComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SchedulerModule,
    PlayerContactModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([]),
  ],
  providers: [
    SchedulerDataService,
    GroupManagerDataService,
    GroupPlayerDataService,
    GroupPlayerSettingsDataService,
    PlayerContactDataService,
    MatchLabelPipe,
    MatchScorePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
