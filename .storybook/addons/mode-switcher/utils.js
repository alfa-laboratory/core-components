import { extractMixinContent, getOrCreateStyleTag } from '../utils';

import indigoDark from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-indigo.css';
import bluetintDark from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-bluetint.css';
import darkStyles from '!!raw-loader!./dark.css';

export const MODES = ['light', 'dark'];
export const MODE_COLORS_TAG_ID = 'mode-colors';

export const darkColorsMap = {
    indigo: extractMixinContent(indigoDark),
    bluetint: extractMixinContent(bluetintDark),
};

export function setModeVars(mode) {
    const vars = mode === 'dark' ? `:root { ${darkColorsMap['indigo']} }\n${darkStyles}` : '';

    getOrCreateStyleTag(MODE_COLORS_TAG_ID).innerHTML = vars;
}
