import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LocationType } from '../location.schema';

export class CreateLocationDto {
  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    enum: LocationType,
    example: LocationType.WAREHOUSE,
  })
  @IsEnum(LocationType)
  type!: LocationType;

  @ApiProperty({ example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2' })
  @IsUUID()
  storeId!: string;

  @ApiPropertyOptional({
    example: 'Toshkent sh., Chilonzor tumani',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
