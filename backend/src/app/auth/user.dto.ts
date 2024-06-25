import { EmailValidator } from '@/custom-validator/Email';
import { PasswordValidator } from '@/custom-validator/Password';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@/utils/enum';

export class RegisterDto {
  @ApiProperty({ type: () => String })
  @IsString()
  @MaxLength(30, { message: 'username không quá 30 ký tự' })
  username: string;

  @ApiProperty({ type: () => String })
  @IsString()
  @EmailValidator({ message: 'Không đúng định dạng gmail' })
  @MaxLength(30, { message: 'Email không được quá 30 ký tự' })
  email: string;

  @ApiProperty({ type: () => String })
  @IsString()
  @PasswordValidator({
    message:
      'Mật khẩu có ít nhất 7 ký tự, gồm 1 chữ hoa, 1 chũ thường và 1 ký tự đặc biệt',
  })
  @MaxLength(30, { message: 'Mật khẩu quá dài' })
  password: string;

  @ApiProperty({ type: () => RoleEnum, enum: RoleEnum, default: 'user' })
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;
}

export class LoginDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'username/email không được quá 30 ký tự' })
  username: string;

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'mật khẩu không được quá 30 ký tự' })
  password: string;
}

export class UserDto {
  id: string;

  @IsString()
  @MaxLength(30, { message: 'username không quá 30 ký tự' })
  username: string;

  @IsString()
  @EmailValidator({ message: 'Không đúng định dạng gmail' })
  email: string;

  @Exclude()
  @IsString()
  @PasswordValidator({ message: 'Không đúng định dạng password' })
  password: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class PasswordDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateInfoUserDto {
  @ApiProperty({ type: () => String })
  @IsString()
  username: string;

  @ApiProperty({ type: () => String })
  @IsString()
  fullName: string;

  @ApiProperty({ type: () => String })
  @IsString()
  gender: string;

  @ApiProperty({ type: () => String })
  @IsString()
  phone: string;

  @ApiProperty({ type: () => String })
  @IsString()
  email: string;

  @ApiProperty({ type: () => String })
  @IsString()
  address: string;
}

export class RefreshTokenDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  'refresh-token': string;
}

export class ResultLogin {
  refreshToken?: string;
}
