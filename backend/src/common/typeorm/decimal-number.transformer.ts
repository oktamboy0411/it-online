import { ValueTransformer } from 'typeorm';

export const decimalNumberTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => Number(value),
};
