import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from '../product.schema';

export class ProductAttributeDto {
  @ApiProperty({ example: 'brand' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Apple' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  value!: string;
}

export class ProductImageDto {
  @ApiProperty({ example: 'https://cdn.example.com/products/iphone-front.jpg' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUrl()
  @MaxLength(1000)
  url!: string;

  @ApiPropertyOptional({ example: 'Front view', nullable: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;
}

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 13 Pro Max' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'Apple iPhone 13 Pro Max 256GB, qora rang' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ example: '6f4b53d0-98c7-4d76-8d02-4c56f57334f2' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ example: '67d4e61b-29cb-4f62-b5a1-2e4d8b02f111' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  unitId!: string;

  @ApiProperty({ example: 'brand_apple' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  brandName!: string;

  @ApiProperty({ example: 'IP13PM-BASE' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code!: string;

  @ApiPropertyOptional({
    type: [ProductImageDto],
    example: [
      {
        url: 'https://cdn.example.com/products/iphone-front.jpg',
        description: 'Front view',
      },
      {
        url: 'https://cdn.example.com/products/iphone-back.jpg',
        description: 'Back view',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiPropertyOptional({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    default: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    type: [ProductAttributeDto],
    example: [
      { name: 'brand', value: 'Apple' },
      { name: 'model', value: 'iPhone 13 Pro Max' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes?: ProductAttributeDto[];
}
