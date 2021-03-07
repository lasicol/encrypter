import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;
    this.validateArgs(body);
    return super.canActivate(context);
  }

  private validateArgs(body: any) {
    const errMsg = [];
    if (!body.email) {
      errMsg.push('email should not be empty');
    }
    if (!body.password) {
      errMsg.push('password should not be empty');
    }
    if (errMsg.length) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: errMsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
