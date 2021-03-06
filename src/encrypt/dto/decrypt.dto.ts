import { IsString, IsNotEmpty } from 'class-validator';

export class DecryptDto {
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNotEmpty()
  @IsString()
  key: string;
}
