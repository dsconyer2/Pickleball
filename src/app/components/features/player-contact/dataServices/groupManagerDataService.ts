import { Injectable } from '@angular/core';

import { GroupEntity } from '../reducers/group-manager.reducer';

@Injectable()
export class GroupManagerDataService {

  groupKey = 'pickleballGroups';
  constructor() {}

  addGroup(group: GroupEntity) {
    const localGroups: GroupEntity[] =
        localStorage.getItem(this.groupKey) ? JSON.parse(localStorage.getItem(this.groupKey)) : [];
    localGroups.push(group);
    localStorage.setItem(this.groupKey, JSON.stringify(localGroups));
  }

  removeGroup(group: GroupEntity) {
    const localGroups: GroupEntity[] =
        localStorage.getItem(this.groupKey) ? JSON.parse(localStorage.getItem(this.groupKey)) : [];
    const newGroups = localGroups.filter(aGroup => aGroup.groupId !== group.groupId);
    localStorage.setItem(this.groupKey, JSON.stringify(newGroups));
  }

  loadGroups(): GroupEntity[] {
    const localGroups: GroupEntity[] =
        localStorage.getItem(this.groupKey) ? JSON.parse(localStorage.getItem(this.groupKey)) : [];
    return localGroups;
  }

}
