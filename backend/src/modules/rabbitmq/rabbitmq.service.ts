import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_CLIENT } from './rabbitmq.constants';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(RABBITMQ_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  async emit(pattern: string, payload: Record<string, unknown>): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, payload));
  }
}
