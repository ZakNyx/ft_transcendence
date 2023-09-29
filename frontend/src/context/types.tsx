export interface User {
  username: string;
  displayname: string;
  status: string;

  wins: number;
  loses: number;
  winrate: number;
  gamesPlayed: number;
  elo: number;

  status2fa: Boolean;
  validated: Boolean;

  friendstatus: string;
  friends?: User[];
  friendOf?: User[];
  blocks?: User[];
  blockedBy?: User[];
  requested?: User[];
  requestedBy?: User[];

  notifications: Notification[];
}

export interface Notification {
  id: number;
  reciever: String;
  sender: string;
  type: string;
  data: string;
}
