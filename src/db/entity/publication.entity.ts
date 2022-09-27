import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Subreddit } from "./subreddit.entity";

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

  @Column({ default: false })
  isPosted: boolean;

  @ManyToOne(() => Subreddit, (subreddit) => subreddit.publications)
  subreddit: Subreddit;
}
