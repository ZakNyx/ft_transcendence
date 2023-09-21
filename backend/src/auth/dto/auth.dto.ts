import { IsNotEmpty, IsString } from 'class-validator';

export class twoFacVerifyDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class validate2faDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
