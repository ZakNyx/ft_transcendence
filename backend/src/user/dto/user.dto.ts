import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
export class body {
  @IsString()
  @IsNotEmpty()
  public roomName: string;

  @IsEmail({}, { each: true }) // Apply IsEmail validator to each element of the array
  @IsNotEmpty()
  public email: string[];
}