import { getOrCreateStyleTag } from '../utils';

import darkStyles from '!!postcss-loader!./dark.css';

export const MODES = ['light', 'dark'];
export const MODE_COLORS_TAG_ID = 'mode-colors';

export function setModeVars(mode) {
    const vars = mode === 'dark' ? darkStyles : '';

    getOrCreateStyleTag(MODE_COLORS_TAG_ID).innerHTML = vars;
}
