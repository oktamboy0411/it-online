import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location, LocationType } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { StockService } from '../stock/stock.service';
import { Supplier } from '../supplier/supplier.schema';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { StockIn } from './stock-in.schema';

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn)
    private readonly stockInRepository: Repository<StockIn>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly stockService: StockService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createStockInDto: CreateStockInDto): Promise<StockIn> {
    await this.ensureProductExists(createStockInDto.productId);
    await this.ensureWarehouseLocation(createStockInDto.locationId);

    if (createStockInDto.supplierId) {
      await this.ensureSupplierExists(createStockInDto.supplierId);
    }

    const stockIn = this.stockInRepository.create(createStockInDto);
    const savedStockIn = await this.stockInRepository.save(stockIn);

    await this.stockService.increaseQuantity(
      savedStockIn.productId,
      savedStockIn.locationId,
      savedStockIn.quantity,
    );

    await this.rabbitmqService.emit('stock-in.created', {
      id: savedStockIn.id,
      productId: savedStockIn.productId,
      locationId: savedStockIn.locationId,
      quantity: savedStockIn.quantity,
      costPrice: savedStockIn.costPrice,
      supplierId: savedStockIn.supplierId,
    });

    return this.findOne(savedStockIn.id);
  }

  async findAll(): Promise<StockIn[]> {
    return this.stockInRepository.find({
      relations: { product: true, location: true, supplier: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StockIn> {
    const stockIn = await this.stockInRepository.findOne({
      where: { id },
      relations: { product: true, location: true, supplier: true },
    });

    if (!stockIn) {
      throw new NotFoundException(`StockIn with id ${id} not found`);
    }

    return stockIn;
  }

  private async ensureProductExists(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
  }

  private async ensureWarehouseLocation(locationId: string): Promise<void> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${locationId} not found`);
    }

    if (location.type !== LocationType.WAREHOUSE) {
      throw new HttpException(
        'StockIn is allowed only for warehouse locations',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async ensureSupplierExists(supplierId: string): Promise<void> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${supplierId} not found`);
    }
  }
}
