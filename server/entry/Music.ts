import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;
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
}
