import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CategoryModule,
  HelloModule,
  LocationModule,
  ProductModule,
  RabbitmqModule,
  RedisModule,
  SaleItemModule,
  SaleModule,
  StockInModule,
  StockModule,
  StockOutModule,
  StoreModule,
  SupplierModule,
  UnitModule,
  UserModule,
} from '../modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RedisModule,
    RabbitmqModule,
    HelloModule,
    UserModule,
    CategoryModule,
    ProductModule,
    StoreModule,
    LocationModule,
    SupplierModule,
    UnitModule,
    StockModule,
    StockInModule,
    StockOutModule,
    SaleModule,
    SaleItemModule,
  ],
})
export class AppModule {}
