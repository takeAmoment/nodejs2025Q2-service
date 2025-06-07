import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  login: string;

  //exclude only from JSON
  @Exclude({ toPlainOnly: true })
  password: string;

  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
