import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { Sale } from '../sale/sale.schema';
import { StockModule } from '../stock/stock.module';
import { StockOutController } from './stock-out.controller';
import { StockOut } from './stock-out.schema';
import { StockOutService } from './stock-out.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOut, Product, Location, Sale]),
    StockModule,
  ],
  controllers: [StockOutController],
  providers: [StockOutService],
  exports: [StockOutService],
})
export class StockOutModule {}
