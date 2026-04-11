import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { StockModule } from '../stock/stock.module';
import { Supplier } from '../supplier/supplier.schema';
import { StockInController } from './stock-in.controller';
import { StockIn } from './stock-in.schema';
import { StockInService } from './stock-in.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockIn, Product, Location, Supplier]),
    StockModule,
  ],
  controllers: [StockInController],
  providers: [StockInService],
  exports: [StockInService],
})
export class StockInModule {}
