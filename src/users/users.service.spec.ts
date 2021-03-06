import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should finOne', async () => {
    const user = {
      userId: 1,
      email: 'john@change.me',
      password: '$2b$10$bg46anrvkFAts4LmDey1quMjSYnvIsWBDKNlcoDZXgZvxDRwUslDW',
    };

    expect(await service.findOne(user.email)).toEqual(user);
  });
});
