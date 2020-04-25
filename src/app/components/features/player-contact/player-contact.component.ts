import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { PlayerContactAdded } from './actions/player-contact.actions';
import { PlayerContact } from './models';
import { PlayerContactState, selectPlayerContactEntities, selectHighestPlayerId } from './reducers';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-player-contact',
  templateUrl: './player-contact.component.html',
  styleUrls: ['./player-contact.component.css']
})
export class PlayerContactComponent implements OnInit, OnDestroy {
  playerContacts$: Observable<PlayerContact[]>;
  lastPlayerContact$: Observable<PlayerContact>;

  playerContactForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.playerContactForm = fb.group({
      newContact: new FormControl('')
    });
  }

  ngOnInit() {
    this.playerContacts$ = this.store.select(selectPlayerContactEntities);
    this.lastPlayerContact$ = this.store.select(selectHighestPlayerId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  addContact() {
    const contactName = this.playerContactForm.controls.newContact.value;

    let highestId = 0;
    this.lastPlayerContact$.pipe(takeUntil(this.unsubscribe$)).subscribe(aPlayer => highestId = aPlayer.playerContactId);
    const playerId = highestId + 1;

    this.store.dispatch(new PlayerContactAdded(playerId, contactName));

    this.playerContactForm.controls.newContact.setValue('');
  }

}
