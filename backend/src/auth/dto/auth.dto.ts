import { IsNotEmpty, IsString } from 'class-validator';

export class twoFacUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class twoFacVerifyDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}

export class validate2faDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
