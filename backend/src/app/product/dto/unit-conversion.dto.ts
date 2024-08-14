import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UnitConversionDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  unitId: string;

  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: () => Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  retailPrice: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  wholesalePrice: number;
}

export class CreateUnitConversionDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  productId: string;

  dataConversion: UnitConversionDto[];
}
