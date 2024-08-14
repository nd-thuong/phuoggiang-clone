import { QuerySearchDto } from '@/utils/query-search.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UnitConversionDto } from './unit-conversion.dto';
import { Type } from 'class-transformer';
import { BooleanSearchEnum } from '@/utils/enum';

export class ProductDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(5)
  name: string;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @IsJSON()
  images: string;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.productTypeId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  productTypeId: string | null;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.productGroupId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  productGroupId: string | null;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.sizeId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  sizeId: string | null;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.surfaceId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  surfaceId: string | null;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.brandId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  brandId: string | null;

  @ApiProperty({ type: () => String, required: true })
  @IsOptional()
  @ValidateIf((o) => o.brandId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  unitId: string | null;

  @ApiProperty({ type: () => [UnitConversionDto], required: false })
  @IsOptional()
  // @ValidateIf((item) => {
  //   return item.unitConversions !== null;
  // }) // chỉ áp dụng các validator bên dưới khi giá trị không phải là null.
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitConversionDto)
  unitConversions?: UnitConversionDto[];

  @ApiProperty({ type: () => Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  wholesalePrice: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  retailPrice: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  warrantyPeriod: number;

  @IsOptional()
  description: string;

  @IsOptional()
  videoLink: string;

  @IsOptional()
  inStock: boolean;

  @IsOptional()
  isBestSeller: boolean;

  @IsOptional()
  showHomepage: boolean;

  @IsOptional()
  isNew: boolean;
}

export class QuerySearchProduct extends QuerySearchDto {
  @ApiProperty({
    type: () => BooleanSearchEnum,
    enum: BooleanSearchEnum,
    default: 'Both',
    required: false,
  })
  @IsOptional()
  @IsEnum(BooleanSearchEnum)
  showHomePage: BooleanSearchEnum;

  @ApiProperty({
    type: () => BooleanSearchEnum,
    enum: BooleanSearchEnum,
    default: 'Both',
    required: false,
  })
  @IsOptional()
  @IsEnum(BooleanSearchEnum)
  isNew: BooleanSearchEnum;

  @ApiProperty({
    type: () => BooleanSearchEnum,
    enum: BooleanSearchEnum,
    default: 'Both',
    required: false,
  })
  @IsOptional()
  @IsEnum(BooleanSearchEnum)
  isBestSeller: BooleanSearchEnum;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @ValidateIf((o) => o.productTypeId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  productTypeId: string | null;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @ValidateIf((o) => o.productGroupId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  productGroupId: string | null;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @ValidateIf((o) => o.sizeId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  sizeId: string | null;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @ValidateIf((o) => o.surfaceId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  surfaceId: string | null;

  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @ValidateIf((o) => o.brandId !== null) // chỉ áp dụng @IsString khi giá trị không phải là null.
  @IsString()
  brandId: string | null;
}
