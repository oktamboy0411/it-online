import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Sale } from '../sale/sale.schema';
import { StockService } from '../stock/stock.service';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { StockOut } from './stock-out.schema';

@Injectable()
export class StockOutService {
  constructor(
    @InjectRepository(StockOut)
    private readonly stockOutRepository: Repository<StockOut>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly stockService: StockService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createStockOutDto: CreateStockOutDto): Promise<StockOut> {
    await this.ensureProductExists(createStockOutDto.productId);
    await this.ensureLocationExists(createStockOutDto.locationId);
    await this.ensureSaleExists(createStockOutDto.saleId);

    await this.stockService.decreaseQuantity(
      createStockOutDto.productId,
      createStockOutDto.locationId,
      createStockOutDto.quantity,
    );

    const stockOut = this.stockOutRepository.create(createStockOutDto);
    const savedStockOut = await this.stockOutRepository.save(stockOut);

    await this.rabbitmqService.emit('stock-out.created', {
      id: savedStockOut.id,
      productId: savedStockOut.productId,
      locationId: savedStockOut.locationId,
      quantity: savedStockOut.quantity,
      sellingPrice: savedStockOut.sellingPrice,
      saleId: savedStockOut.saleId,
    });

    return this.findOne(savedStockOut.id);
  }

  async findAll(): Promise<StockOut[]> {
    return this.stockOutRepository.find({
      relations: { product: true, location: true, sale: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StockOut> {
    const stockOut = await this.stockOutRepository.findOne({
      where: { id },
      relations: { product: true, location: true, sale: true },
    });

    if (!stockOut) {
      throw new NotFoundException(`StockOut with id ${id} not found`);
    }

    return stockOut;
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

  private async ensureSaleExists(saleId: string): Promise<void> {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with id ${saleId} not found`);
    }
  }
}
