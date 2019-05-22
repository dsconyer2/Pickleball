import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerContactComponent } from './player-contact.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { GroupManagerComponent } from './components/group-manager/group-manager.component';
import { GroupPlayerManagerComponent } from './components/group-player-manager/group-player-manager.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { GroupManagerEffects } from './effects/group-manager.effects';
import { GroupPlayerEffects } from './effects/group-player.effects';
import { PlayerContactEffects } from './effects/player-contact.effects';
import { EffectsModule } from '@ngrx/effects';
import { AppStartUpEffects } from './effects/app-startup.effects';

@NgModule({
  declarations: [PlayerContactComponent, ContactInfoComponent, GroupManagerComponent, GroupPlayerManagerComponent, GroupInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('playerContactFeature', reducers),
    EffectsModule.forFeature([GroupManagerEffects, GroupPlayerEffects, PlayerContactEffects, AppStartUpEffects])
  ],
  exports: [PlayerContactComponent]
})
export class PlayerContactModule { }
