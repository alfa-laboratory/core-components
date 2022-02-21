import { Amount as DefaultAmount } from './Component';
import { PureAmount } from './pure/Component';

type AmountType = typeof DefaultAmount & { Pure: typeof PureAmount };
export const Amount: AmountType = DefaultAmount as AmountType;
Amount.Pure = PureAmount;

export * from './types';
