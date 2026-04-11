import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { decimalNumberTransformer } from '../../common/typeorm/decimal-number.transformer';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';
import { Supplier } from '../supplier/supplier.schema';

@Entity({ name: 'stock_ins' })
export class StockIn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid' })
  @Index('IDX_stock_ins_productId')
  productId!: string;

  @ManyToOne(() => Location, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'locationId' })
  location!: Location;

  @Column({ type: 'uuid' })
  @Index('IDX_stock_ins_locationId')
  locationId!: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    transformer: decimalNumberTransformer,
  })
  quantity!: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    transformer: decimalNumberTransformer,
  })
  costPrice!: number;

  @ManyToOne(() => Supplier, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplierId' })
  supplier?: Supplier | null;

  @Column({ type: 'uuid', nullable: true })
  supplierId?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
