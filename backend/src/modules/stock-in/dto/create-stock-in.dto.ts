import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateStockInDto {
  @ApiProperty({ example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2' })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    example: '7ab2f740-d3bf-4f26-9c1d-2f44b8f98ef5',
    description: 'Only warehouse location is allowed',
  })
  @IsUUID()
  locationId!: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity!: number;

  @ApiProperty({ example: 800 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice!: number;

  @ApiPropertyOptional({
    example: '8f2f7fd4-5388-4346-a7ab-865bf0f34020',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  supplierId?: string | null;
}
