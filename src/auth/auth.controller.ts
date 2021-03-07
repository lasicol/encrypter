import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guards';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('sign-in')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.signIn(req.user);
  }
}
