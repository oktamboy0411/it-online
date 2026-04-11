import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateStockOutDto {
  @ApiProperty({ example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: '7ab2f740-d3bf-4f26-9c1d-2f44b8f98ef5' })
  @IsUUID()
  locationId!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity!: number;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sellingPrice!: number;

  @ApiProperty({
    example: 'ab4f12b8-2c64-4b95-b3f6-fbf6287f2d0d',
    description: 'Sale check id for linking stock-out item',
  })
  @IsUUID()
  saleId!: string;
}
