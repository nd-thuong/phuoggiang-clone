import { IsArrayNotEmpty } from '@/custom-validator/IsArrayNotEmpty';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductGroupDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'A non-empty array of UUIDs representing the brand IDs.',
    required: true,
    isArray: true,
    type: 'string',
    example:
      '["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]',
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
  @IsArrayNotEmpty({ message: 'brandIds must not be empty' })
  @IsUUID(4, { each: true, message: 'Each brandId must be a valid UUID v4' })
  brandIds: string[];
}
