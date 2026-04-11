import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './unit.schema';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    await this.ensureNameUnique(createUnitDto.name);
    await this.ensureShortNameUnique(createUnitDto.shortName);

    const unit = this.unitRepository.create(createUnitDto);
    const savedUnit = await this.unitRepository.save(unit);

    await this.rabbitmqService.emit('unit.created', {
      id: savedUnit.id,
      name: savedUnit.name,
      shortName: savedUnit.shortName,
    });

    return savedUnit;
  }

  async findAll(): Promise<Unit[]> {
    return this.unitRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } });

    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);

    if (updateUnitDto.name) {
      await this.ensureNameUnique(updateUnitDto.name, id);
    }

    if (updateUnitDto.shortName) {
      await this.ensureShortNameUnique(updateUnitDto.shortName, id);
    }

    Object.assign(unit, updateUnitDto);
    const updatedUnit = await this.unitRepository.save(unit);

    await this.rabbitmqService.emit('unit.updated', {
      id: updatedUnit.id,
      name: updatedUnit.name,
      shortName: updatedUnit.shortName,
    });

    return updatedUnit;
  }

  async remove(id: string): Promise<{ message: string }> {
    const unit = await this.findOne(id);
    await this.unitRepository.remove(unit);

    await this.rabbitmqService.emit('unit.deleted', {
      id: unit.id,
      name: unit.name,
      shortName: unit.shortName,
    });

    return { message: `Unit with id ${id} deleted` };
  }

  private async ensureNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedName = name.trim();

    const existingUnit = await this.unitRepository.findOne({
      where: {
        name: normalizedName,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingUnit) {
      throw new HttpException('Unit name already exists', HttpStatus.CONFLICT);
    }
  }

  private async ensureShortNameUnique(
    shortName: string,
    excludeId?: string,
  ): Promise<void> {
    const normalizedShortName = shortName.trim();

    const existingUnit = await this.unitRepository.findOne({
      where: {
        shortName: normalizedShortName,
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (existingUnit) {
      throw new HttpException(
        'Unit shortName already exists',
        HttpStatus.CONFLICT,
      );
    }
  }
}
