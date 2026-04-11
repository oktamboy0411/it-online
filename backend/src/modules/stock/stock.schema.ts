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
import { decimalNumberTransformer } from '../../common/typeorm/decimal-number.transformer';
import { Location } from '../location/location.schema';
import { Product } from '../product/product.schema';

@Entity({ name: 'stocks' })
@Index('UQ_stocks_product_location', ['productId', 'locationId'], {
  unique: true,
})
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid' })
  @Index('IDX_stocks_productId')
  productId!: string;

  @ManyToOne(() => Location, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'locationId' })
  location!: Location;

  @Column({ type: 'uuid' })
  @Index('IDX_stocks_locationId')
  locationId!: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 3,
    default: 0,
    transformer: decimalNumberTransformer,
  })
  quantity!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
