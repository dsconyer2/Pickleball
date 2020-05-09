import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { Group, GroupPlayer } from 'src/app/components/features/player-contact/models';
import { selectGroupEntities, selectGroupPlayerEntities } from 'src/app/components/features/player-contact/reducers';

import {
  LoadFromGroupUpdated, NbrOfCourtsUpdated, NbrOfPlayersPerCourtUpdated, NbrOfPlayersUpdated,
  PlayerAdded, PlayerRemoveAll, RandomizeOrderUpdated, SchedulerPlayerTypeUpdated,
  SchedulerTypeUpdated, SelectedGroupUpdated, UseNamesForMatchesUpdated,
} from '../../store/actions/scheduler.actions';
import {
  SchedulerState, selectSchedulerLoadFromGroup, selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayers,
  selectSchedulerNbrOfPlayersPerCourt, selectSchedulerPlayerType, selectSchedulerRandomizeOrder,
  selectSchedulerSelectedGroup, selectSchedulerType, selectSchedulerUseNamesForMatches,
} from '../../store/reducers';

@Component({
  selector: 'app-schedule-entry',
  templateUrl: './schedule-entry.component.html',
  styleUrls: ['./schedule-entry.component.css'],
})
export class ScheduleEntryComponent implements OnInit, OnDestroy {

  groups$: Observable<Group[]>;
  groupPlayers$: Observable<GroupPlayer[]>;
  groupPlayers: GroupPlayer[];

  sePlayerType: string;
  seType: string;
  sePlayersPerCourt: number;
  validNbrOfCourts: boolean;

  schedulerPlayerType$: Observable<string>;
  schedulerType$: Observable<string>;
  schedulerNbrOfPlayers$: Observable<number>;
  schedulerNbrOfCourts$: Observable<number>;
  schedulerRandomizeOrder$: Observable<boolean>;
  schedulerUseNamesForMatches$: Observable<boolean>;
  schedulerLoadFromGroup$: Observable<boolean>;
  schedulerSelectedGroup$: Observable<Group>;

  validPlayerCount = true;
  minPlayers: number;
  maxCourts: number;

  scheduleEntryForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<SchedulerState>, private router: Router, fb: FormBuilder) {
    this.scheduleEntryForm = fb.group({
      scheduleType: new FormControl('', Validators.required),
      playerType: new FormControl('', Validators.required),
      loadFromGroup: new FormControl(''),
      groupToLoad: new FormControl(),
      nbrOfPlayersInput: new FormControl(''),
      nbrOfCourtsInput: new FormControl(''),
      randomizeOrder: new FormControl(''),
      useNamesForMatches: new FormControl(''),
    });
  }

  ngOnInit() {
    this.schedulerPlayerType$ = this.store.select(selectSchedulerPlayerType);
    this.schedulerType$ = this.store.select(selectSchedulerType);
    this.schedulerNbrOfPlayers$ = this.store.select(selectSchedulerNbrOfPlayers);
    this.schedulerNbrOfCourts$ = this.store.select(selectSchedulerNbrOfCourts);
    this.schedulerRandomizeOrder$ = this.store.select(selectSchedulerRandomizeOrder);
    this.schedulerUseNamesForMatches$ = this.store.select(selectSchedulerUseNamesForMatches);
    this.schedulerLoadFromGroup$ = this.store.select(selectSchedulerLoadFromGroup);
    this.schedulerSelectedGroup$ = this.store.select(selectSchedulerSelectedGroup);

    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);

    this.groupPlayers$.pipe(takeUntil(this.unsubscribe$)).subscribe(g => this.groupPlayers = g);
    this.schedulerPlayerType$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.playerType.setValue(g);
        this.scheduleEntryForm.controls.playerType.updateValueAndValidity();
      });
    this.schedulerType$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.scheduleType.setValue(g);
        this.scheduleEntryForm.controls.scheduleType.updateValueAndValidity();
      });
    this.schedulerNbrOfPlayers$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.nbrOfPlayersInput.setValue(g);
        this.scheduleEntryForm.controls.nbrOfPlayersInput.updateValueAndValidity();
      });
    this.schedulerNbrOfCourts$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.nbrOfCourtsInput.setValue(g);
        this.scheduleEntryForm.controls.nbrOfCourtsInput.updateValueAndValidity();
      });
    this.schedulerRandomizeOrder$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.randomizeOrder.setValue(g);
        this.scheduleEntryForm.controls.randomizeOrder.updateValueAndValidity();
      });
    this.schedulerUseNamesForMatches$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.useNamesForMatches.setValue(g);
        this.scheduleEntryForm.controls.useNamesForMatches.updateValueAndValidity();
      });
    this.schedulerLoadFromGroup$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((g) => {
        this.scheduleEntryForm.controls.loadFromGroup.setValue(g);
        this.scheduleEntryForm.controls.loadFromGroup.updateValueAndValidity();
      });

    combineLatest([this.groups$, this.schedulerSelectedGroup$]).subscribe(
      ([grp, selGrp]) => {
        grp.forEach((aGrp) => {
          if (aGrp?.groupId === selGrp?.groupId) {
            this.scheduleEntryForm.controls.groupToLoad.setValue(aGrp);
            this.scheduleEntryForm.controls.groupToLoad.updateValueAndValidity();
          }
        });
      },
    );

    this.onScheduleTypeChange();
    this.onPlayerTypeChange();
    this.setValidators();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  setValidators() {
    this.minPlayers = this.scheduleEntryForm.controls.playerType.value === 'Individuals for Doubles' ? 4 : 2;
    this.scheduleEntryForm.controls.nbrOfPlayersInput.setValidators([Validators.required, Validators.min(this.minPlayers)]);
    this.scheduleEntryForm.controls.nbrOfPlayersInput.updateValueAndValidity();
    // King of the court requires nbrOfCourtsInput
    // Tournament does not
    if (this.scheduleEntryForm.controls.scheduleType.value === 'King of the Court') {
      this.maxCourts = Math.max(Math.floor(this.scheduleEntryForm.controls.nbrOfPlayersInput.value / this.sePlayersPerCourt), 1);
      this.scheduleEntryForm.controls.nbrOfCourtsInput
        .setValidators([Validators.required, Validators.min(1), Validators.max(this.maxCourts)]);
      this.scheduleEntryForm.controls.nbrOfCourtsInput.updateValueAndValidity();
    } else {
      this.scheduleEntryForm.controls.nbrOfCourtsInput.setValidators([]);
      this.scheduleEntryForm.controls.nbrOfCourtsInput.updateValueAndValidity();
    }

    // LoadFromGroup turns off nbrOfPlayersInput
    if (this.scheduleEntryForm.controls.loadFromGroup.value) {
      this.scheduleEntryForm.controls.groupToLoad.setValidators([Validators.required, Validators.minLength(1)]);
      this.scheduleEntryForm.controls.groupToLoad.updateValueAndValidity();
    } else {
      this.scheduleEntryForm.controls.groupToLoad.setValidators([]);
      this.scheduleEntryForm.controls.groupToLoad.updateValueAndValidity();
    }
  }

  loadPlayers() {
    this.store.dispatch(new PlayerRemoveAll());

    if (this.scheduleEntryForm.controls.loadFromGroup.value) {
      if (!!this.scheduleEntryForm.controls.groupToLoad.value) {
        // get selectedGroup.
        const groupToLoad: Group = this.scheduleEntryForm.controls.groupToLoad.value;
        let selectedGroupPlayer;
        this.groupPlayers$.pipe(
          take(1),
          tap(groupPlayers => selectedGroupPlayer = groupPlayers.find(gp => gp.groupPlayerId === groupToLoad.enabledPlayerId)),
        ).subscribe();
        // load players
        selectedGroupPlayer.playerContacts.forEach((aPlayer) => {
          this.store.dispatch(new PlayerAdded(aPlayer.playerContactId, aPlayer.name, true, true, 0, {}, {}));
        });
        this.scheduleEntryForm.controls.nbrOfPlayersInput.setValue(selectedGroupPlayer.playerContacts.length);
        this.scheduleEntryForm.controls.nbrOfPlayersInput.updateValueAndValidity();
      }
    } else {
      this.scheduleEntryForm.controls.useNamesForMatches.setValue(false);
      this.scheduleEntryForm.controls.useNamesForMatches.updateValueAndValidity();
      for (let index = 0; index < this.scheduleEntryForm.controls.nbrOfPlayersInput.value; index++) {
        this.store.dispatch(new PlayerAdded(index + 1, (index + 1).toString(), true, true, 0, {}, {}));
      }
    }
  }

  onSubmit() {
    if (this.scheduleEntryForm.valid) {

      this.loadPlayers();

      this.store.dispatch(new SchedulerPlayerTypeUpdated(this.sePlayerType));
      this.store.dispatch(new SchedulerTypeUpdated(this.scheduleEntryForm.controls.scheduleType.value));
      this.store.dispatch(new NbrOfPlayersUpdated(this.scheduleEntryForm.controls.nbrOfPlayersInput.value));
      this.store.dispatch(new NbrOfCourtsUpdated(this.scheduleEntryForm.controls.nbrOfCourtsInput.value));
      this.store.dispatch(new NbrOfPlayersPerCourtUpdated(this.sePlayersPerCourt));
      this.store.dispatch(new RandomizeOrderUpdated(this.scheduleEntryForm.controls.randomizeOrder.value));
      this.store.dispatch(new UseNamesForMatchesUpdated(this.scheduleEntryForm.controls.useNamesForMatches.value));
      this.store.dispatch(new LoadFromGroupUpdated(this.scheduleEntryForm.controls.loadFromGroup.value));
      this.store.dispatch(new SelectedGroupUpdated(this.scheduleEntryForm.controls.groupToLoad.value));

      this.router.navigate(['/scheduleTournament']);
    }
  }

  onPlayerTypeChange() {
    this.sePlayerType = this.scheduleEntryForm.controls.playerType.value;
    this.sePlayersPerCourt = (this.sePlayerType === 'Individuals for Doubles') ? 4 : 2;
    this.setValidators();
  }

  onScheduleTypeChange() {
    this.seType = this.scheduleEntryForm.controls.scheduleType.value;
    if (this.scheduleEntryForm.controls.scheduleType.value === 'Tournament'
      && this.sePlayerType === 'Individuals for Doubles') {
      this.scheduleEntryForm.controls.playerType.setValue('Teams');
      this.scheduleEntryForm.controls.playerType.updateValueAndValidity();
    }
    this.setValidators();
  }

  loadFromGroupChanged() {
    this.setValidators();
  }

  groupToLoadChanged() {
    this.loadPlayers();
  }

}
