import { Amount as DefaultAmount } from './component';
import { PureAmount } from './pure/component';

type AmountType = typeof DefaultAmount & { Pure: typeof PureAmount };
// TODO: можно ли с этим что-то придумать?
const Amount: AmountType = DefaultAmount as AmountType;
Amount.Pure = PureAmount;

export { Amount };
