import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { email } = user;
      return { email };
    }
    return null;
  }

  async signIn(user: IUser) {
    const payload = { email: user.email, sub: user.userId };
    return {
      authToken: this.jwtService.sign(payload),
    };
  }
}
