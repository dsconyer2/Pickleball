import { Action } from '@ngrx/store';

export const APP_START = '[application] start';
export class ApplicationStarted implements Action {
  readonly type = APP_START;
  constructor() { }
}

export const APPLICATION_ERROR = '[application] error';
export class ApplicationError implements Action {
  readonly type = APPLICATION_ERROR;
  constructor(public message: string, public feature: string) { }
}


export type AppActions = ApplicationStarted | ApplicationError;
