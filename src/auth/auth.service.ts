import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService
    ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user ${username}`);
    if (username === 'testuser' && password === 'testpass') {
      this.logger.debug(`User ${username} validated successfully`);
      return { userId: 'userId', username };
    }
    this.logger.warn(`Invalid login attempt for user ${username}`);
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    return this.usersService.createUser(username, password);
  }
}
