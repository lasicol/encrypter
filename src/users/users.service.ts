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
      password: 'changeme1',
    },
    {
      userId: 2,
      email: 'mary@change.mea',
      password: 'changeme2',
    },
  ];

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
