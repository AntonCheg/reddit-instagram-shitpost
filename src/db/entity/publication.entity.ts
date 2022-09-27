import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Subreddit } from './subreddit.entity';

export enum PublicationPostedStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
@Entity()
export class Publication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  ups: number;

  @Column({ default: false })
  isVideo: boolean;

  @Column({ default: PublicationPostedStatusEnum.PENDING, enum: PublicationPostedStatusEnum })
  postedStatus: PublicationPostedStatusEnum;

  @ManyToOne(() => Subreddit, (subreddit) => subreddit.publications, {
    cascade: true,
  })
  subreddit: Subreddit;

  static findPending() {
    return this.createQueryBuilder('publication')
      .where('publication.postedStatus = :postedStatus', { postedStatus: PublicationPostedStatusEnum.PENDING })
      .getOne();
  }
}
