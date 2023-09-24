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