export interface PlayerContact {
  playerContactId: number;
  name?: string;
}

export interface Group {
  groupId: number;
  name?: string;
  groupPlayerId?: number;
  enabledPlayerId?: number;
}

export interface GroupPlayer {
  groupPlayerId: number;
  playerContacts?: PlayerContact[];
}
