import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { GroupManagerComponent } from './components/group-manager/group-manager.component';
import { GroupPlayerManagerComponent } from './components/group-player-manager/group-player-manager.component';
import { AppStartUpEffects } from './effects/app-startup.effects';
import { GroupManagerEffects } from './effects/group-manager.effects';
import { GroupPlayerSettingsEffects } from './effects/group-player-settings.effects';
import { GroupPlayerEffects } from './effects/group-player.effects';
import { PlayerContactEffects } from './effects/player-contact.effects';
import { PlayerContactComponent } from './player-contact.component';
import { reducers } from './reducers';

@NgModule({
  declarations: [
    PlayerContactComponent,
    ContactInfoComponent,
    GroupManagerComponent,
    GroupPlayerManagerComponent,
    GroupInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('playerContactFeature', reducers),
    EffectsModule.forFeature([GroupManagerEffects, GroupPlayerEffects, GroupPlayerSettingsEffects, PlayerContactEffects, AppStartUpEffects]),
  ],
  exports: [PlayerContactComponent],
})
export class PlayerContactModule {}
