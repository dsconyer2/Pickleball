import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GroupAdded } from '../../actions/group-manager.actions';
import { GroupPlayerCreated } from '../../actions/group-player.actions';
import { Group, GroupPlayer } from '../../models';
import { PlayerContactState, selectGroupEntities, selectHighestGroupId, selectHighestGroupPlayerId } from '../../reducers';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css'],
})
export class GroupManagerComponent implements OnInit, OnDestroy {
  groups$: Observable<Group[]>;
  lastGroup$: Observable<Group>;
  lastGroupPlayer$: Observable<GroupPlayer>;

  groupManagerForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.groupManagerForm = fb.group({
      newGroup: new FormControl(''),
    });
  }

  ngOnInit() {
    this.groups$ = this.store.select(selectGroupEntities);
    this.lastGroup$ = this.store.select(selectHighestGroupId);
    this.lastGroupPlayer$ = this.store.select(selectHighestGroupPlayerId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  addGroup() {

    const groupName = this.groupManagerForm.controls.newGroup.value;
    let highestId = 0;
    this.lastGroup$.pipe(takeUntil(this.unsubscribe$)).subscribe(aGroup => highestId = aGroup.groupId);

    const groupId = highestId + 1;

    highestId = 0;
    this.lastGroupPlayer$.pipe(takeUntil(this.unsubscribe$)).subscribe(aGroupPlayer => highestId = aGroupPlayer.groupPlayerId);
    const groupPlayerId = highestId + 1;
    const enabledPlayerId = highestId + 2;

    this.store.dispatch(new GroupPlayerCreated(groupPlayerId));
    this.store.dispatch(new GroupPlayerCreated(enabledPlayerId));
    this.store.dispatch(new GroupAdded(groupId, groupName, groupPlayerId, enabledPlayerId));

    this.groupManagerForm.controls.newGroup.setValue('');
  }

}
