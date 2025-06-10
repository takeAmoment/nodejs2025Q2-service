import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  login: string;

  //exclude only from JSON
  @Exclude({ toPlainOnly: true })
  password: string;

  version: number;
  createdAt: number | Date;
  updatedAt: number | Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    if (partial.createdAt instanceof Date) {
      this.createdAt = partial.createdAt.getTime();
    } else if (typeof partial.createdAt === 'number') {
      this.createdAt = partial.createdAt;
    }

    if (partial.updatedAt instanceof Date) {
      this.updatedAt = partial.updatedAt.getTime();
    } else if (typeof partial.updatedAt === 'number') {
      this.createdAt = partial.updatedAt;
    }
  }
}
