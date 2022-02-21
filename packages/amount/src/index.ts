import { Amount as DefaultAmount } from './component';
import { PureAmount } from './pure/component';

type AmountType = typeof DefaultAmount & { Pure: typeof PureAmount };
export const Amount: AmountType = DefaultAmount as AmountType;
Amount.Pure = PureAmount;

export * from './types';
