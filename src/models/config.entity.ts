import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Config extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  applyYear: number;

  @Column()
  applySemester: number;
}
