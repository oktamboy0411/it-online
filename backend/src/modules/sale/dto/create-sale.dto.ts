import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { PaymentType, SaleStatus } from '../sale.schema';

export class CreateSaleDto {
  @ApiProperty({ example: '7ab2f740-d3bf-4f26-9c1d-2f44b8f98ef5' })
  @IsUUID()
  locationId!: string;

  @ApiProperty({ example: '47f56320-b060-4d7f-a69a-6b17fdf95d6d' })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;

  @ApiProperty({ example: 50000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount!: number;

  @ApiProperty({ example: 50000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paidAmount!: number;

  @ApiProperty({ enum: PaymentType, example: PaymentType.CASH })
  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @ApiProperty({
    enum: SaleStatus,
    example: SaleStatus.COMPLETED,
    required: false,
    default: SaleStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;
}
