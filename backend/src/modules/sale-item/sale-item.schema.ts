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
import { Product } from '../product/product.schema';
import { Sale } from '../sale/sale.schema';

@Entity({ name: 'sale_items' })
@Index('IDX_sale_items_saleId', ['saleId'])
@Index('IDX_sale_items_productId', ['productId'])
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Sale, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale!: Sale;

  @Column({ type: 'uuid' })
  saleId!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

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
  price!: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    transformer: decimalNumberTransformer,
  })
  total!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
