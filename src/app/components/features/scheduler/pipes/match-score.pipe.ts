import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pbsMatchScore' })
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
