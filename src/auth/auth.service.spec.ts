import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, IUser } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('valdiate user', () => {
    it('should validate user', async () => {
      const fakeUser: IUser = {
        email: 'fake@email.com',
        password: 'fakePassword',
        userId: 123,
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(fakeUser);
      jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue({ email: fakeUser.email });
      expect(
        await authService.validateUser(fakeUser.email, fakeUser.password),
      ).toEqual({ email: fakeUser.email });
    });
  });
});
