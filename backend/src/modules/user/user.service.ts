import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Store } from '../store/store.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.ensureStoreAssignmentRule(createUserDto.role, createUserDto.storeId);

    if (createUserDto.storeId) {
      await this.ensureStoreExists(createUserDto.storeId);
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    await this.rabbitmqService.emit('user.created', {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      isActive: savedUser.isActive,
    });

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const nextRole = updateUserDto.role ?? user.role;
    const nextStoreId =
      updateUserDto.storeId !== undefined
        ? updateUserDto.storeId
        : user.storeId;

    this.ensureStoreAssignmentRule(nextRole, nextStoreId);

    if (nextStoreId) {
      await this.ensureStoreExists(nextStoreId);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    await this.rabbitmqService.emit('user.updated', {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });

    return updatedUser;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    await this.rabbitmqService.emit('user.deleted', {
      id: user.id,
      phone: user.phone,
    });

    return { message: `User with id ${id} deleted` };
  }

  private ensureStoreAssignmentRule(
    role: UserRole,
    storeId?: string | null,
  ): void {
    const rolesRequiringStore = [
      UserRole.STORE_MANAGER,
      UserRole.CASHIER,
      UserRole.DELIVERY,
    ];

    if (rolesRequiringStore.includes(role) && !storeId) {
      throw new HttpException(
        'storeId is required for StoreManager, Cashier, and Delivery roles',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async ensureStoreExists(storeId: string): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${storeId} not found`);
    }
  }
}
