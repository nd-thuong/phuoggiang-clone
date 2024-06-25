import { toVietnamTimezone } from '@/helpers/request.helper';
import { BaseEntity } from '@/utils/Base.entity';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  Index,
} from 'typeorm';

@Entity('files')
export class FileUploadEntity extends BaseEntity {
  @Column()
  filename: string;

  @Column({ nullable: true })
  @Index()
  path: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

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
