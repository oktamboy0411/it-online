import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { StockInService } from './stock-in.service';

@Controller('stock-ins')
@ApiTags('StockIn')
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @ApiOperation({ summary: 'Create stock-in transaction' })
  @Post()
  create(@Body() createStockInDto: CreateStockInDto) {
    return this.stockInService.create(createStockInDto);
  }

  @ApiOperation({ summary: 'Get all stock-in transactions' })
  @Get()
  findAll() {
    return this.stockInService.findAll();
  }

  @ApiOperation({ summary: 'Get stock-in by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.stockInService.findOne(id);
  }
}
