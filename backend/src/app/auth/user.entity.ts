import {
  Entity,
  Column,
  Unique,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
  Index,
} from 'typeorm';
// import { BaseEntity } from '@/utils/Base.entity';
import { BaseEntity } from '../../utils/Base.entity';
import { RefreshToken } from './refresh-token.entity';
// import { UserDto } from './user.dto';
import { Exclude } from 'class-transformer';
import { GenderEnum, RoleEnum } from '@/utils/enum';
import { toVietnamTimezone } from '@/helpers/request.helper';

@Unique(['username'])
@Unique(['email'])
@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  @Index()
  username: string;

  @Column()
  @Index()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  @BeforeInsert()
  setCreateDate() {
    this.createdAt = toVietnamTimezone(new Date());
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = toVietnamTimezone(new Date());
  }

  @BeforeRemove()
  setDeleteDate() {
    this.deletedAt = toVietnamTimezone(new Date());
  }
}
