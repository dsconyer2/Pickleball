import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[pbsValidNbrOfCourts]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidNbrOfCourtsDirective, multi: true },
  ],
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
    const invalidNbrOfCourts = control.value.nbrOfPlayersInput >= playerOpenings;

    /* check validation rules */
    if (control.value.scheduleType === 'King of the Court') {
      return null;
    } else {
      return { validNbrOfCourts: invalidNbrOfCourts };
    }
  }

}
