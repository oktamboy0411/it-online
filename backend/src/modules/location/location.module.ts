import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/store.schema';
import { LocationController } from './location.controller';
import { Location } from './location.schema';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Store])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
