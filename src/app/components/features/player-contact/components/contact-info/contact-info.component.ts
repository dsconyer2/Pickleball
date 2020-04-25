import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayerContactState } from '../../reducers';
import { PlayerContact } from '../../models';
import { PlayerContactRemoved } from '../../actions/player-contact.actions';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent implements OnInit {

  @Input() contact: PlayerContact;
  contactInfoForm: FormGroup;

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.contactInfoForm = fb.group({});
  }

  ngOnInit() {
  }

  removeContact() {
    this.store.dispatch(new PlayerContactRemoved(this.contact.playerContactId));
  }

}
