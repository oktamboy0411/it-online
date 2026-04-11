import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.ensureNameUnique(createCategoryDto.name);

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    await this.rabbitmqService.emit('category.created', {
      id: savedCategory.id,
      name: savedCategory.name,
    });

    return savedCategory;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      await this.ensureNameUnique(updateCategoryDto.name, id);
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    await this.rabbitmqService.emit('category.updated', {
      id: updatedCategory.id,
      name: updatedCategory.name,
    });

    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);

    await this.rabbitmqService.emit('category.deleted', {
      id: category.id,
      name: category.name,
    });

    return { message: `Category with id ${id} deleted` };
  }

  private async ensureNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedName = name.trim();

    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: normalizedName,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingCategory) {
      throw new HttpException(
        'Category name already exists',
        HttpStatus.CONFLICT,
      );
    }
  }
}
