import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  unitId: string;

  @ApiProperty({ type: () => Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @IsString()
  note: string;
}
