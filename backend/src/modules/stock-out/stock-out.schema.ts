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
import { Sale } from '../sale/sale.schema';

@Entity({ name: 'stock_outs' })
export class StockOut {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid' })
  @Index('IDX_stock_outs_productId')
  productId!: string;

  @ManyToOne(() => Location, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'locationId' })
  location!: Location;

  @Column({ type: 'uuid' })
  @Index('IDX_stock_outs_locationId')
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
  sellingPrice!: number;

  @ManyToOne(() => Sale, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'saleId' })
  sale!: Sale;

  @Column({ type: 'uuid' })
  @Index('IDX_stock_outs_saleId')
  saleId!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
