import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublishMessageDto } from './dto/publish-message.dto';
import { RabbitmqService } from './rabbitmq.service';

@Controller('rabbitmq')
@ApiTags('RabbitMQ')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Post('publish')
  @ApiOperation({ summary: 'Publish event to RabbitMQ queue' })
  async publish(@Body() publishMessageDto: PublishMessageDto) {
    await this.rabbitmqService.emit(
      publishMessageDto.pattern,
      publishMessageDto.payload,
    );

    return { message: 'Message published successfully' };
  }
}
