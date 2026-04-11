import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { StockController } from './stock.controller';
import { Stock } from './stock.schema';
import { StockService } from './stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Product, Location])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
