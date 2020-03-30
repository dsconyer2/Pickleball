import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[pbsValidNbrOfCourts]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidNbrOfCourtsDirective, multi: true }
  ]
})
export class ValidNbrOfCourtsDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    /* validation rules */
    let playersPerCourt = 0;
    if (control.value.playerType === 'Individuals for Doubles') {
      playersPerCourt = 4;
    } else {
      playersPerCourt = 2;
    }
    const playerOpenings = control.value.nbrOfCourtsInput * playersPerCourt;
    console.log('PlayersPerCourt = ', playersPerCourt);
    console.log('NbrOfCourts = ', control.value.nbrOfCourtsInput);
    console.log('OpeningsForPlayers = ', playerOpenings);
    const invalidNbrOfCourts = control.value.nbrOfPlayersInput >= playerOpenings;
    console.log('validNbrOfCourts = ', invalidNbrOfCourts);

    /* check validation rules */
    if (control.value.scheduleType === 'King of the Court') {
      return null;
    } else {
      return { validNbrOfCourts: invalidNbrOfCourts };
    }
  }

}

