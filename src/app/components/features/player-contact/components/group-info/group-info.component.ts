import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../../models';
import { PlayerContactState } from '../../reducers';
import { Store } from '@ngrx/store';
import { GroupRemoved } from '../../actions/group-manager.actions';
import { GroupPlayerDeleted } from '../../actions/group-player.actions';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  @Input() group: Group;
  groupInfoForm: FormGroup;

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.groupInfoForm = fb.group({});
  }

  ngOnInit() {
  }

  removeGroup() {
    this.store.dispatch(new GroupPlayerDeleted(this.group.groupPlayerId));
    this.store.dispatch(new GroupPlayerDeleted(this.group.enabledPlayerId));
    this.store.dispatch(new GroupRemoved(this.group.groupId));
  }

}
