import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../location/location.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleStatus } from './sale.schema';
import { User, UserRole } from '../user/user.schema';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const location = await this.ensureLocationExists(createSaleDto.locationId);
    const cashier = await this.ensureCashierExists(createSaleDto.userId);

    if (cashier.storeId && cashier.storeId !== location.storeId) {
      throw new HttpException(
        'Cashier must belong to the same store as sale location',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createSaleDto.customerId) {
      await this.ensureCustomerExists(createSaleDto.customerId);
    }

    this.ensureValidAmounts(
      createSaleDto.totalAmount,
      createSaleDto.paidAmount,
    );

    const sale = this.saleRepository.create({
      ...createSaleDto,
      status: createSaleDto.status ?? SaleStatus.PENDING,
    });
    const savedSale = await this.saleRepository.save(sale);

    await this.rabbitmqService.emit('sale.created', {
      id: savedSale.id,
      locationId: savedSale.locationId,
      userId: savedSale.userId,
      customerId: savedSale.customerId,
      totalAmount: savedSale.totalAmount,
      paidAmount: savedSale.paidAmount,
      paymentType: savedSale.paymentType,
      status: savedSale.status,
      createdAt: savedSale.createdAt,
    });

    return this.findOne(savedSale.id);
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: { location: true, user: true, customer: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: { location: true, user: true, customer: true },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    const nextLocation = updateSaleDto.locationId
      ? await this.ensureLocationExists(updateSaleDto.locationId)
      : await this.ensureLocationExists(sale.locationId);

    const nextCashier = updateSaleDto.userId
      ? await this.ensureCashierExists(updateSaleDto.userId)
      : await this.ensureCashierExists(sale.userId);

    if (nextCashier.storeId && nextCashier.storeId !== nextLocation.storeId) {
      throw new HttpException(
        'Cashier must belong to the same store as sale location',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateSaleDto.customerId) {
      await this.ensureCustomerExists(updateSaleDto.customerId);
    }

    const nextTotal = updateSaleDto.totalAmount ?? sale.totalAmount;
    const nextPaid = updateSaleDto.paidAmount ?? sale.paidAmount;
    this.ensureValidAmounts(nextTotal, nextPaid);

    Object.assign(sale, updateSaleDto);
    const updatedSale = await this.saleRepository.save(sale);

    await this.rabbitmqService.emit('sale.updated', {
      id: updatedSale.id,
      locationId: updatedSale.locationId,
      userId: updatedSale.userId,
      customerId: updatedSale.customerId,
      totalAmount: updatedSale.totalAmount,
      paidAmount: updatedSale.paidAmount,
      paymentType: updatedSale.paymentType,
      status: updatedSale.status,
    });

    return this.findOne(updatedSale.id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const sale = await this.findOne(id);
    await this.saleRepository.remove(sale);

    await this.rabbitmqService.emit('sale.deleted', {
      id: sale.id,
      locationId: sale.locationId,
    });

    return { message: `Sale with id ${id} deleted` };
  }

  private async ensureLocationExists(locationId: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${locationId} not found`);
    }

    return location;
  }

  private async ensureCashierExists(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.role !== UserRole.CASHIER) {
      throw new HttpException(
        'userId must belong to a cashier user',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  private async ensureCustomerExists(customerId: string): Promise<User> {
    const customer = await this.userRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    if (customer.role !== UserRole.CUSTOMER) {
      throw new HttpException(
        'customerId must belong to a customer user',
        HttpStatus.BAD_REQUEST,
      );
    }

    return customer;
  }

  private ensureValidAmounts(totalAmount: number, paidAmount: number): void {
    if (paidAmount > totalAmount) {
      throw new HttpException(
        'paidAmount cannot be greater than totalAmount',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
