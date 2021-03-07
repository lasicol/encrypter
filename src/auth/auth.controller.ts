import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guards';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
