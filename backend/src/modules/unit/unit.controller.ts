import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';

@Controller('units')
@ApiTags('Units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @ApiOperation({ summary: 'Create unit' })
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @ApiOperation({ summary: 'Get all units' })
  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @ApiOperation({ summary: 'Get unit by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitService.findOne(id);
  }

  @ApiOperation({ summary: 'Update unit by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, updateUnitDto);
  }

  @ApiOperation({ summary: 'Delete unit by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unitService.remove(id);
  }
}
