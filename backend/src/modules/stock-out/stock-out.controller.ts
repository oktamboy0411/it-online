import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { StockOutService } from './stock-out.service';

@Controller('stock-outs')
@ApiTags('StockOut')
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @ApiOperation({ summary: 'Create stock-out transaction' })
  @Post()
  create(@Body() createStockOutDto: CreateStockOutDto) {
    return this.stockOutService.create(createStockOutDto);
  }

  @ApiOperation({ summary: 'Get all stock-out transactions' })
  @Get()
  findAll() {
    return this.stockOutService.findAll();
  }

  @ApiOperation({ summary: 'Get stock-out by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.stockOutService.findOne(id);
  }
}
