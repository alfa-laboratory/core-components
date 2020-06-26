import { Amount as DefaultAmount } from './component';
import { PureAmount } from './pure/component';
import { AmountProps } from './types';

type AmountType = typeof DefaultAmount & { Pure: typeof PureAmount };
const Amount: AmountType = DefaultAmount as AmountType;
Amount.Pure = PureAmount;

export { Amount, AmountProps };
