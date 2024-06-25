import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(255)
  name: string;
}
