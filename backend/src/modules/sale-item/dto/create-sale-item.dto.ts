import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ example: 'ab4f12b8-2c64-4b95-b3f6-fbf6287f2d0d' })
  @IsUUID()
  saleId!: string;

  @ApiProperty({ example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity!: number;

  @ApiProperty({ example: 25000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;
}
