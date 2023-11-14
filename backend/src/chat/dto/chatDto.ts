export class actionDTO {
  userId: string;
  subjectId: string;
  roomId: number;
  action: string;
}

export class dmDTO {
  senderId: string;
  receiverName: string;
}

export class friendRequestDTO {
  befriendedUserId: string;
  issuerId: string;
  notifId:  number;
}

export class messageDTO {
  messageContent : string;
  dmId?: number;
  roomId: number;
  sentAt: Date;
  senderId: string;
}

export class roomDTO {
  ownerId: string;
  roomName: string;
  joinTime: Date;
  visibility: string;
  image: string;
  imageExtension: string;
  password?: string;
}

export class roomInviteDTO {
  invitee: string;
  senderId: string;
  roomId: number;
  notifId: number;
}

export class roomJoinDTO {
  visibility : string;
  password?: string;
  roomId: number;
  userId: string;
  joinDate: Date;
}