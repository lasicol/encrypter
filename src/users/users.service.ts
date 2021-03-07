import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export interface IUser {
  userId: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: Array<IUser> = [
    {
      userId: 1,
      email: 'john@change.me',
      password: '$2b$10$bg46anrvkFAts4LmDey1quMjSYnvIsWBDKNlcoDZXgZvxDRwUslDW',
    },
    {
      userId: 2,
      email: 'mary@change.mea',
      password: '$2b$10$93EBuDPR/2LpfOU6liX2w.iI3znVIVepkJJLaiJwJaRKprP3915yO',
    },
  ];

  //for the purpose of this task, the key assiciated to the user is stored in memory
  private keys: Map<string, string> = new Map();

  async findOne(email: string): Promise<IUser | undefined> {
    return this.users.find((user) => user.email === email);
  }

  assignKey(email: string, key: string) {
    this.keys.set(email, key);
  }

  getKey(email: string): string {
    return this.keys.get(email);
  }
}
