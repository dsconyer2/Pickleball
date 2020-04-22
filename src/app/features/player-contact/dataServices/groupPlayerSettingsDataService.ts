import { Injectable } from '@angular/core';
import { GroupPlayerSettingsEntity } from '../reducers/group-player-settings.reducer';
import { Group } from '../models';

@Injectable()
export class GroupPlayerSettingsDataService {

  groupPlayerSelectedGroupKey = 'pickleballGroupPlayerSelectedGroup';

  constructor() { }


  updateGroupPlayerSetting(settingKey: string, settingValue: string | number | boolean | Group) {
    localStorage.setItem(settingKey, JSON.stringify(settingValue));
  }

  loadGroupPlayerSettings(): GroupPlayerSettingsEntity {
    const localGroupPlayerSelectedGroup: Group =
        localStorage.getItem(this.groupPlayerSelectedGroupKey)
        ? JSON.parse(localStorage.getItem(this.groupPlayerSelectedGroupKey)) : undefined;
    return {
      selectedGroup: localGroupPlayerSelectedGroup
    };
  }

}
