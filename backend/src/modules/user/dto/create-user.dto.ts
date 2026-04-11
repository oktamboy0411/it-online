import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  lastName!: string;

  @ApiProperty({ example: '+998901112233' })
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  phone!: string;

  @ApiProperty({ example: 'hashed_password_value' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  passwordHash!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2',
    description:
      'StoreManager, Cashier, Delivery rollari uchun storeId yuborilishi kerak.',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string | null;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
