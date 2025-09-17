import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.username, body.password);
  }
   @Post('register')
  async register(@Body() body: RegisterDto) {
    // returns created user (without password)
    return this.authService.register(body.username, body.password);
  }
}
