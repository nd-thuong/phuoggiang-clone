import { QuerySearchDto } from '@/utils/query-search.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(5)
  name: string;

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

export class QuerySearchProduct extends QuerySearchDto {
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
