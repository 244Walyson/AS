import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':identifier')
  async findOne(@Param('identifier') identifier: string) {
    return this.userService.findOne(identifier);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('verify')
  verifyEmail(@Body() body: { token: string }) {
    return this.userService.verifyEmail(body.token);
  }

  @Post('reset-password/request')
  sendResetPasswordEmail(@Body() body: { username: string }) {
    return this.userService.sendResetPasswordEmail(body.username);
  }

  @Post('reset-password/confirm')
  resetPassword(
    @Body()
    body: {
      token: string;
      newPassword: string;
    },
  ) {
    return this.userService.resetPassword(body);
  }
}
