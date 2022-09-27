import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Publication } from './publication.entity';

@Entity()
export class Subreddit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Publication, (publication) => publication.subreddit)
  @JoinTable()
  publications: Publication[];
}
