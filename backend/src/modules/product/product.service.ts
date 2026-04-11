import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Category } from '../category/category.schema';
import { Unit } from '../unit/unit.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    await this.ensureNameUnique(createProductDto.name);
    await this.ensureCodeUnique(createProductDto.code);
    await this.ensureCategoryExists(createProductDto.categoryId);
    await this.ensureUnitExists(createProductDto.unitId);

    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    await this.rabbitmqService.emit('product.created', {
      id: savedProduct.id,
      name: savedProduct.name,
      code: savedProduct.code,
      unitId: savedProduct.unitId,
      status: savedProduct.status,
    });

    return this.findOne(savedProduct.id);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: { category: true, unit: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, unit: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.name) {
      await this.ensureNameUnique(updateProductDto.name, id);
    }

    if (updateProductDto.code) {
      await this.ensureCodeUnique(updateProductDto.code, id);
    }

    if (updateProductDto.unitId) {
      await this.ensureUnitExists(updateProductDto.unitId);
    }

    if (updateProductDto.categoryId) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    await this.rabbitmqService.emit('product.updated', {
      id: updatedProduct.id,
      name: updatedProduct.name,
      code: updatedProduct.code,
      unitId: updatedProduct.unitId,
      status: updatedProduct.status,
    });

    return this.findOne(updatedProduct.id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    await this.rabbitmqService.emit('product.deleted', {
      id: product.id,
      code: product.code,
    });

    return { message: `Product with id ${id} deleted` };
  }

  private async ensureCodeUnique(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedCode = code.trim();

    const existingProduct = await this.productRepository.findOne({
      where: {
        code: normalizedCode,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingProduct) {
      throw new HttpException(
        'Product code already exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  private async ensureNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedName = name.trim();

    const existingProduct = await this.productRepository.findOne({
      where: {
        name: normalizedName,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingProduct) {
      throw new HttpException(
        'Product name already exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  private async ensureUnitExists(unitId: string): Promise<void> {
    const unit = await this.unitRepository.findOne({ where: { id: unitId } });

    if (!unit) {
      throw new NotFoundException(`Unit with id ${unitId} not found`);
    }
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
