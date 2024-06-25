import { IsArrayNotEmpty } from '@/custom-validator/IsArrayNotEmpty';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveFileDto {
  @ApiProperty({
    description: 'filenames không được bỏ trống',
    required: true,
    isArray: true,
    type: 'string',
    example: '["abc.png", "xyz.png"]',
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return Array.isArray(value)
        ? value
        : JSON.parse(value.replace(/'/g, '"'));
    }
  })
  @IsArray()
  @IsArrayNotEmpty({ message: 'filenames must not be empty' })
  filenames: string[];
}
