import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ orderBy: {} })
export class Music {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  uuid: string;
  @Column()
  name: string;
  @Column("text", { array: true })
  authors: string[];
  @Column()
  albums?: string;
  @Column()
  song_15s_src?: string;
  @Column({ nullable: true })
  cover_src?: string;
  @Column({ default: false })
  censored: boolean;
  @CreateDateColumn()
  createdAt: Date;
}
