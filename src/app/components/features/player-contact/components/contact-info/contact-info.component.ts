import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { PlayerContactRemoved } from '../../actions/player-contact.actions';
import { PlayerContact } from '../../models';
import { PlayerContactState } from '../../reducers';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent implements OnInit {

  @Input() contact: PlayerContact;
  contactInfoForm: FormGroup;

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.contactInfoForm = fb.group({});
  }

  ngOnInit() {}

  removeContact() {
    this.store.dispatch(new PlayerContactRemoved(this.contact.playerContactId));
  }

}
