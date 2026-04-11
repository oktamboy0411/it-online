import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { SaleItemService } from './sale-item.service';

@Controller('sale-items')
@ApiTags('SaleItems')
export class SaleItemController {
  constructor(private readonly saleItemService: SaleItemService) {}

  @ApiOperation({ summary: 'Create sale item' })
  @Post()
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    return this.saleItemService.create(createSaleItemDto);
  }

  @ApiOperation({ summary: 'Get all sale items' })
  @Get()
  findAll() {
    return this.saleItemService.findAll();
  }

  @ApiOperation({ summary: 'Get sale items by sale id' })
  @ApiParam({ name: 'saleId', type: String, format: 'uuid' })
  @Get('sale/:saleId')
  findBySaleId(@Param('saleId', new ParseUUIDPipe()) saleId: string) {
    return this.saleItemService.findBySaleId(saleId);
  }

  @ApiOperation({ summary: 'Get sale item by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.saleItemService.findOne(id);
  }
}
