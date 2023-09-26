import { IsNotEmpty, IsString } from "class-validator";

export class notificationBodyDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNotEmpty()
  @IsString()
  reciever: string;
}

export class replyToFriendRequestDTO {

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  id: number;
}

export class cancelNotificationDTO {
  @IsNotEmpty()
  @IsString()
  reciever: string;
}