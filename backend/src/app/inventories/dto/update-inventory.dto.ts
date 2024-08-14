import { CreateInventoryDto } from './create-inventory.dto';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInventoryDto extends CreateInventoryDto {
  @ApiProperty({ type: () => Number })
  @IsNumber()
  quantityEdit: number;
}

export class QuerySearchInventoryDto extends QuerySearchDto {
  @IsOptional()
  @IsString()
  productId: string;
}
