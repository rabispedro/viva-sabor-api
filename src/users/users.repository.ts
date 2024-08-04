import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UUID } from 'crypto';

@Injectable()
export class UsersRepository {
  private users: User[];

  create(user: User): UUID {
    user.id = crypto.randomUUID();
    this.users.push(user);
    return user.id;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: UUID): User | undefined {
    return this.users.find((user: User) => user.id === id);
  }

  update(id: UUID, user: User): boolean {
    const idx = this.users.findIndex((user: User) => user.id === id);
    if (idx === -1) return false;

    this.users.splice(idx, 1, user);
    return true;
  }

  remove(id: UUID): boolean {
    const idx = this.users.findIndex((user: User) => user.id === id);
    if (idx === -1) return false;

    this.users.splice(idx, 1);
    return true;
  }
}
