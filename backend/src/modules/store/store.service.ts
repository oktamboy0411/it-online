import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { User, UserRole } from '../user/user.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store, StoreStatus } from './store.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    await this.ensureOwnerIsStoreManager(createStoreDto.owner);

    const store = this.storeRepository.create(createStoreDto);
    this.applySubscriptionAutoBlock(store);
    const savedStore = await this.storeRepository.save(store);

    await this.rabbitmqService.emit('store.created', {
      id: savedStore.id,
      name: savedStore.name,
      status: savedStore.status,
      owner: savedStore.owner,
    });

    return this.findOne(savedStore.id);
  }

  async findAll(): Promise<Store[]> {
    const stores = await this.storeRepository.find({
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      stores.map((store) => this.ensureBlockedWhenSubscriptionExpired(store)),
    );
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    return this.ensureBlockedWhenSubscriptionExpired(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    const nextOwner = updateStoreDto.owner ?? store.owner;
    await this.ensureOwnerIsStoreManager(nextOwner);

    Object.assign(store, updateStoreDto);
    this.applySubscriptionAutoBlock(store);
    const updatedStore = await this.storeRepository.save(store);

    await this.rabbitmqService.emit('store.updated', {
      id: updatedStore.id,
      name: updatedStore.name,
      status: updatedStore.status,
      owner: updatedStore.owner,
    });

    return this.findOne(updatedStore.id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);

    await this.rabbitmqService.emit('store.deleted', {
      id: store.id,
      owner: store.owner,
    });

    return { message: `Store with id ${id} deleted` };
  }

  private async ensureOwnerIsStoreManager(ownerId: string): Promise<void> {
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!owner) {
      throw new NotFoundException(`Owner user with id ${ownerId} not found`);
    }

    if (owner.role !== UserRole.STORE_MANAGER) {
      throw new HttpException(
        'Owner must have StoreManager role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private applySubscriptionAutoBlock(store: Store): void {
    if (this.isSubscriptionExpired(store.subscriptionPaidUntil)) {
      store.status = StoreStatus.BLOCKED;
    }
  }

  private async ensureBlockedWhenSubscriptionExpired(
    store: Store,
  ): Promise<Store> {
    if (
      store.status !== StoreStatus.BLOCKED &&
      this.isSubscriptionExpired(store.subscriptionPaidUntil)
    ) {
      store.status = StoreStatus.BLOCKED;
      return this.storeRepository.save(store);
    }

    return store;
  }

  private isSubscriptionExpired(
    subscriptionPaidUntil?: Date | string | null,
  ): boolean {
    if (!subscriptionPaidUntil) {
      return false;
    }

    const paidUntilDate =
      subscriptionPaidUntil instanceof Date
        ? subscriptionPaidUntil
        : new Date(subscriptionPaidUntil);

    if (Number.isNaN(paidUntilDate.getTime())) {
      return false;
    }

    return Date.now() > paidUntilDate.getTime();
  }
}
