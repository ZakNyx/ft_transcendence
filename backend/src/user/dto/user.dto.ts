import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class userDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class roomDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  roomname: string;
}