import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class updateNameDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  name: string;
}

export class SearchNameNameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class updatePictureDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  image: string;
}
