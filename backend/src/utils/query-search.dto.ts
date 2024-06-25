/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QuerySearchDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  take: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  keySearch: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({ required: false })
  @IsOptional()
  fromDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  toDate: string;
}

export class QuerySearchProductWith_Brands_Sizes extends QuerySearchDto {
  @ApiProperty({ required: false, default: [], type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : JSON.parse(value.replace(/'/g, '"'));
  })
  brandIds: string[];

  @ApiProperty({ required: false, default: [], type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : JSON.parse(value.replace(/'/g, '"')),
  )
  sizeIds: string[];
}
