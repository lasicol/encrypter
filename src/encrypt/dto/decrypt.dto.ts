import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DecryptDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  key: string;
}
