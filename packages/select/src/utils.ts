import { OptionShape, GroupShape } from './Component';

export const isGroup = (item: OptionShape | GroupShape): item is GroupShape =>
    Object.prototype.hasOwnProperty.call(item, 'options');
