import { IsOptional, IsString } from 'class-validator';

export class RemoveFileDto {
  @IsString()
  filename: string;

  @IsString()
  id: string;

  @IsOptional()
  url?: string;
}
