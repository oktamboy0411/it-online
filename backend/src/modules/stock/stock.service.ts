import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Stock } from './stock.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({
      relations: { product: true, location: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: { product: true, location: true },
    });

    if (!stock) {
      throw new NotFoundException(`Stock with id ${id} not found`);
    }

    return stock;
  }

  async increaseQuantity(
    productId: string,
    locationId: string,
    quantity: number,
  ): Promise<Stock> {
    await this.ensureProductExists(productId);
    await this.ensureLocationExists(locationId);

    const stock = await this.findOrCreateStock(productId, locationId);
    stock.quantity += quantity;
    const updatedStock = await this.stockRepository.save(stock);

    await this.rabbitmqService.emit('stock.updated', {
      id: updatedStock.id,
      productId: updatedStock.productId,
      locationId: updatedStock.locationId,
      quantity: updatedStock.quantity,
    });

    return this.findOne(updatedStock.id);
  }

  async decreaseQuantity(
    productId: string,
    locationId: string,
    quantity: number,
  ): Promise<Stock> {
    await this.ensureProductExists(productId);
    await this.ensureLocationExists(locationId);

    const stock = await this.stockRepository.findOne({
      where: { productId, locationId },
    });

    if (!stock || stock.quantity < quantity) {
      throw new HttpException(
        'Insufficient stock for this location',
        HttpStatus.CONFLICT,
      );
    }

    stock.quantity -= quantity;
    const updatedStock = await this.stockRepository.save(stock);

    await this.rabbitmqService.emit('stock.updated', {
      id: updatedStock.id,
      productId: updatedStock.productId,
      locationId: updatedStock.locationId,
      quantity: updatedStock.quantity,
    });

    return this.findOne(updatedStock.id);
  }

  private async findOrCreateStock(
    productId: string,
    locationId: string,
  ): Promise<Stock> {
    const existingStock = await this.stockRepository.findOne({
      where: { productId, locationId },
    });

    if (existingStock) {
      return existingStock;
    }

    return this.stockRepository.create({
      productId,
      locationId,
      quantity: 0,
    });
  }

  private async ensureProductExists(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
  }

  private async ensureLocationExists(locationId: string): Promise<void> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${locationId} not found`);
    }
  }
}
