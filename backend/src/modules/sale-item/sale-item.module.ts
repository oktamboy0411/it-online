import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.schema';
import { Sale } from '../sale/sale.schema';
import { StockOutModule } from '../stock-out/stock-out.module';
import { SaleItemController } from './sale-item.controller';
import { SaleItem } from './sale-item.schema';
import { SaleItemService } from './sale-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleItem, Sale, Product]),
    StockOutModule,
  ],
  controllers: [SaleItemController],
  providers: [SaleItemService],
  exports: [SaleItemService],
})
export class SaleItemModule {}
