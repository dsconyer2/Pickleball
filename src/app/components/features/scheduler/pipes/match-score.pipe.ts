import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models';

@Pipe({ name: 'matchScore' })
export class MatchScorePipe implements PipeTransform {
  transform(aScore: number): string {
    let matchLabel = '  ';

    if (aScore > -1) {
      matchLabel += '( ';
      matchLabel += aScore;
      matchLabel += ' )';
    }

    matchLabel += '  ';
    return matchLabel;
  }
}
