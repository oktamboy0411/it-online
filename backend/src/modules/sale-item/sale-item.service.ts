import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Sale, SaleStatus } from '../sale/sale.schema';
import { StockOutService } from '../stock-out/stock-out.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { SaleItem } from './sale-item.schema';

@Injectable()
export class SaleItemService {
  constructor(
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly stockOutService: StockOutService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createSaleItemDto: CreateSaleItemDto): Promise<SaleItem> {
    const sale = await this.ensureSaleExists(createSaleItemDto.saleId);
    await this.ensureProductExists(createSaleItemDto.productId);

    if (sale.status === SaleStatus.CANCELLED) {
      throw new HttpException(
        'Cannot add items to a cancelled sale',
        HttpStatus.BAD_REQUEST,
      );
    }

    const total = Number(
      (createSaleItemDto.quantity * createSaleItemDto.price).toFixed(2),
    );

    const saleItem = this.saleItemRepository.create({
      ...createSaleItemDto,
      total,
    });

    const savedSaleItem = await this.saleItemRepository.save(saleItem);

    await this.stockOutService.create({
      productId: savedSaleItem.productId,
      locationId: sale.locationId,
      quantity: savedSaleItem.quantity,
      sellingPrice: savedSaleItem.price,
      saleId: savedSaleItem.saleId,
    });

    await this.recalculateSaleTotal(savedSaleItem.saleId);

    await this.rabbitmqService.emit('sale-item.created', {
      id: savedSaleItem.id,
      saleId: savedSaleItem.saleId,
      productId: savedSaleItem.productId,
      quantity: savedSaleItem.quantity,
      price: savedSaleItem.price,
      total: savedSaleItem.total,
    });

    return this.findOne(savedSaleItem.id);
  }

  async findAll(): Promise<SaleItem[]> {
    return this.saleItemRepository.find({
      relations: { sale: true, product: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySaleId(saleId: string): Promise<SaleItem[]> {
    await this.ensureSaleExists(saleId);

    return this.saleItemRepository.find({
      where: { saleId },
      relations: { product: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<SaleItem> {
    const saleItem = await this.saleItemRepository.findOne({
      where: { id },
      relations: { sale: true, product: true },
    });

    if (!saleItem) {
      throw new NotFoundException(`SaleItem with id ${id} not found`);
    }

    return saleItem;
  }

  private async recalculateSaleTotal(saleId: string): Promise<void> {
    const raw = await this.saleItemRepository
      .createQueryBuilder('saleItem')
      .select('COALESCE(SUM(saleItem.total), 0)', 'total')
      .where('saleItem.saleId = :saleId', { saleId })
      .getRawOne<{ total: string }>();

    const sale = await this.ensureSaleExists(saleId);
    const nextTotal = Number(raw?.total ?? 0);

    sale.totalAmount = nextTotal;

    if (sale.paidAmount > sale.totalAmount) {
      sale.paidAmount = sale.totalAmount;
    }

    await this.saleRepository.save(sale);
  }

  private async ensureSaleExists(saleId: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { id: saleId } });

    if (!sale) {
      throw new NotFoundException(`Sale with id ${saleId} not found`);
    }

    return sale;
  }

  private async ensureProductExists(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
  }
}
