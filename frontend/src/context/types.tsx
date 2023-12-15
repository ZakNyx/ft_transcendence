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

//////////////////////////////

export interface Token {
  sub: string;
  email: string;
}

export interface userData {
  image: string;
  id: string;
  username : string;
  matchHistory: object;
  wins: number;
  losses: number;
}


export interface SenderData {
  image: string;
  username: string;
}

export interface NotifData{
  type: string
}

export interface ContainerRef {
  scrollTop: any,
  scrollHeight: any
}

enum Role {
  USER,
  ADMIN,
  OWNER
}


export interface Ifriends {
  date: Date,
  userId: string,
  state: string,
}

export interface Imsg {
  id: number,
  sentAt: Date,
  messageContent: string,
  dmId: number,
  senderId: string,
  roomId: number,
}

export interface Idms {
  id: number,
  creatorId: string,
  participants: Iuser[],
  msg: Imsg[],
  lastUpdate: Date
}
export interface Inotif {
  id: number,
  senderId: string,
  reciever: string,
  type: string,
  read: boolean,
  interactedWith: boolean,
  createdAt: Date,
  updatedAt: Date,

}

export interface iRoomMember {
  id: number,
  RoomId: number,
  memberId: string,
  role: Role,
  muted: boolean,
  muteExpiration: Date,
  room: Iroom[],
  member: Iuser,
  joinTime: Date,
  inviterId: string

}
export interface Iroom {
  id: number,
  msgs: Imsg[],
  image: string,
  RoomName: string,
  visibility: string,
  password?: string,
  RoomMembers: iRoomMember[],
  bannedUsers: string,
  lastUpdate: Date,
}
export interface Irooms {
  id: number,
  RoomId: number,
  memverId: string,
  role: Role,
  muted: boolean,
  muteExpiration: Date,
  room: Iroom[]
}
export interface IroomInvites {
  userId: string,
  roomId: number,
  date: Date
}
export interface ImatchHistory {
  selfScore: string,
  opponentId: string,
  opponentScore: string
}
export interface Iuser {
  id: number,
  userId: string,
  email: string,
  username: string,
  displayname: string,
  image: string,
  friends: Ifriends[],
  blockedUsers: string[],
  Status: string,
  wins: number,
  losses: number,
  achievements: string[],
  dms: Idms[],
  messages: Imsg[],
  participantNotifs: Inotif[],
  rooms: Irooms[],
  roomInvites: IroomInvites[],
  otp_secret?: string,
  otp_authurl: string,
  otp_enabled: boolean,
  otp_validated: boolean
  matchHistory: ImatchHistory[]

}

export interface IuserW {
  id: number,
  userId: string,
  email: string,
  username: string,
  displayname: string,
  image: string,
  friends: Ifriends[],
  blockedUsers: string[],
  Status: string,
  wins: number,
  losses: number,
  achievements: string[],
  dms: Idms[],
  messages: Imsg[],
  participantNotifs: Inotif[],
  rooms: Irooms[],
  roomInvites: IroomInvites[],
  otp_secret?: string,
  otp_authurl: string,
  otp_enabled: boolean,
  otp_validated: boolean
  matchHistory: ImatchHistory[]
  winRate : number
}

export interface IleaderBoard {
  id: number,
  userId: string,
  username: string,
  wins: number,
  losses: number,
  image: string,
  winRate: number
}


export interface achievements {
  name: string,
  description: string,
  isValid: boolean
}