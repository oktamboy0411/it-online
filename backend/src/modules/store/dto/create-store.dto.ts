import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StoreStatus } from '../store.schema';

export class CreateStoreDto {
  @ApiProperty({ example: 'Main Store' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: '+998901112233', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional({
    enum: StoreStatus,
    example: StoreStatus.ACTIVE,
    default: StoreStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @ApiPropertyOptional({
    example: '2026-05-09T10:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  subscriptionPaidUntil?: string | null;

  @ApiProperty({
    example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2',
    description: 'StoreManager roliga ega user id (uuid).',
  })
  @IsUUID()
  owner!: string;
}
