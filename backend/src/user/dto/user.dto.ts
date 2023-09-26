import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class userDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}