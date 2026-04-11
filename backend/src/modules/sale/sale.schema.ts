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
import { User } from '../user/user.schema';

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

export enum SaleStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

@Entity({ name: 'sales' })
@Index('IDX_sales_locationId', ['locationId'])
@Index('IDX_sales_userId', ['userId'])
@Index('IDX_sales_customerId', ['customerId'])
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Location, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'locationId' })
  location!: Location;

  @Column({ type: 'uuid' })
  locationId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer?: User | null;

  @Column({ type: 'uuid', nullable: true })
  customerId?: string | null;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: decimalNumberTransformer,
  })
  totalAmount!: number;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: decimalNumberTransformer,
  })
  paidAmount!: number;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  paymentType!: PaymentType;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  status!: SaleStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
