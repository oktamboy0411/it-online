import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.schema';
import { Unit } from '../unit/unit.schema';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductImage = {
  url: string;
  description?: string | null;
};

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @Column({ type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => Unit, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;

  @Column({ type: 'uuid' })
  unitId!: string;

  @Column()
  brandName!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  images!: ProductImage[];

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status!: ProductStatus;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  attributes!: ProductAttribute[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
