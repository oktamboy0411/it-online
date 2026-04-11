import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './supplier.schema';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    await this.ensureNameUnique(createSupplierDto.name);

    const supplier = this.supplierRepository.create(createSupplierDto);
    const savedSupplier = await this.supplierRepository.save(supplier);

    await this.rabbitmqService.emit('supplier.created', {
      id: savedSupplier.id,
      name: savedSupplier.name,
    });

    return savedSupplier;
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    return supplier;
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id);

    if (updateSupplierDto.name) {
      await this.ensureNameUnique(updateSupplierDto.name, id);
    }

    Object.assign(supplier, updateSupplierDto);
    const updatedSupplier = await this.supplierRepository.save(supplier);

    await this.rabbitmqService.emit('supplier.updated', {
      id: updatedSupplier.id,
      name: updatedSupplier.name,
    });

    return updatedSupplier;
  }

  async remove(id: string): Promise<{ message: string }> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);

    await this.rabbitmqService.emit('supplier.deleted', {
      id: supplier.id,
      name: supplier.name,
    });

    return { message: `Supplier with id ${id} deleted` };
  }

  private async ensureNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedName = name.trim();

    const existingSupplier = await this.supplierRepository.findOne({
      where: {
        name: normalizedName,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingSupplier) {
      throw new HttpException(
        'Supplier name already exists',
        HttpStatus.CONFLICT,
      );
    }
  }
}
