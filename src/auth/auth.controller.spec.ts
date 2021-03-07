import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IUser } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should sign in', async () => {
    const fakeUser: IUser = {
      email: 'fake@email.com',
      password: 'fakePassword',
      userId: 123,
    };
    const fakeReq = { user: fakeUser };
    jest.spyOn(service, 'signIn').mockResolvedValue({ authToken: 'fakeToken' });
    expect(await controller.signIn(fakeReq, new SignInDto())).toEqual({
      authToken: 'fakeToken',
    });
  });
});
