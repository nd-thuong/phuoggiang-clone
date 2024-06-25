import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('refresh-token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  isRevoked: boolean;

  @Column()
  expiryDate: Date;

  @Column()
  userId: string; // Khóa ngoại tham chiếu đến User

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn({ name: 'userId' }) // Tên cột khóa ngoại trong bảng 'refresh_token'
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // @BeforeInsert()
  // logBefore() {
  //   console.log(this);
  // }
}
