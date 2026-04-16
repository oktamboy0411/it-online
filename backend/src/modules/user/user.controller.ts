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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  USER_CREATE_RULE,
  USER_FIND_ALL_RULE,
  USER_FIND_ONE_RULE,
  USER_REMOVE_RULE,
  USER_UPDATE_RULE,
} from './user-role.rules';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Login user', description: 'Public endpoint' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create user',
    description: `Allowed roles: ${USER_CREATE_RULE.allowedRoles.join(', ')}`,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all users',
    description: `Allowed roles: ${USER_FIND_ALL_RULE.allowedRoles.join(', ')}`,
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get user by id',
    description: `Allowed roles: ${USER_FIND_ONE_RULE.allowedRoles.join(', ')}`,
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user by id',
    description: `Allowed roles: ${USER_UPDATE_RULE.allowedRoles.join(', ')}`,
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete user by id',
    description: `Allowed roles: ${USER_REMOVE_RULE.allowedRoles.join(', ')}`,
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
