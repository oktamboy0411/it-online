import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';

@Controller('stocks')
@ApiTags('Stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({ summary: 'Get all current stock snapshots' })
  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @ApiOperation({ summary: 'Get stock snapshot by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.stockService.findOne(id);
  }
}
