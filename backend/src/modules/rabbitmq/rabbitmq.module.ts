import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from './rabbitmq.constants';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqService } from './rabbitmq.service';

@Global()
@Module({
  providers: [
    {
      provide: RABBITMQ_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const urls = [
          configService.get<string>('RABBITMQ_URL', 'amqp://127.0.0.1:5672'),
        ];
        const queue = configService.get<string>(
          'RABBITMQ_QUEUE',
          'linko_main_queue',
        );

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls,
            queue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
    RabbitmqService,
  ],
  controllers: [RabbitmqController],
  exports: [RABBITMQ_CLIENT, RabbitmqService],
})
export class RabbitmqModule {}
