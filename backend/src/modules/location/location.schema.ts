import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../store/store.schema';

export enum LocationType {
  WAREHOUSE = 'warehouse',
  STORE = 'store',
}

@Entity({ name: 'locations' })
@Index('IDX_locations_storeId', ['storeId'])
@Index('UQ_locations_single_warehouse_per_store', ['storeId'], {
  unique: true,
  where: `"type" = 'warehouse'`,
})
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  type!: LocationType;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store!: Store;

  @Column({ type: 'uuid' })
  storeId!: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
