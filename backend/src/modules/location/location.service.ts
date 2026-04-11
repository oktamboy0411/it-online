import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Store } from '../store/store.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, LocationType } from './location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    await this.ensureStoreExists(createLocationDto.storeId);

    if (createLocationDto.type === LocationType.WAREHOUSE) {
      await this.ensureSingleWarehousePerStore(createLocationDto.storeId);
    }

    const location = this.locationRepository.create(createLocationDto);
    const savedLocation = await this.locationRepository.save(location);

    await this.rabbitmqService.emit('location.created', {
      id: savedLocation.id,
      name: savedLocation.name,
      type: savedLocation.type,
      storeId: savedLocation.storeId,
      isActive: savedLocation.isActive,
    });

    return this.findOne(savedLocation.id);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      relations: { store: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: { store: true },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    const nextStoreId = updateLocationDto.storeId ?? location.storeId;
    const nextType = updateLocationDto.type ?? location.type;

    await this.ensureStoreExists(nextStoreId);

    if (nextType === LocationType.WAREHOUSE) {
      await this.ensureSingleWarehousePerStore(nextStoreId, id);
    }

    Object.assign(location, updateLocationDto);
    const updatedLocation = await this.locationRepository.save(location);

    await this.rabbitmqService.emit('location.updated', {
      id: updatedLocation.id,
      name: updatedLocation.name,
      type: updatedLocation.type,
      storeId: updatedLocation.storeId,
      isActive: updatedLocation.isActive,
    });

    return this.findOne(updatedLocation.id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);

    await this.rabbitmqService.emit('location.deleted', {
      id: location.id,
      storeId: location.storeId,
    });

    return { message: `Location with id ${id} deleted` };
  }

  private async ensureStoreExists(storeId: string): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${storeId} not found`);
    }
  }

  private async ensureSingleWarehousePerStore(
    storeId: string,
    excludeLocationId?: string,
  ): Promise<void> {
    const existingWarehouse = await this.locationRepository.findOne({
      where: {
        storeId,
        type: LocationType.WAREHOUSE,
        ...(excludeLocationId ? { id: Not(excludeLocationId) } : {}),
      },
    });

    if (existingWarehouse) {
      throw new HttpException(
        'This store already has a warehouse location',
        HttpStatus.CONFLICT,
      );
    }
  }
}
