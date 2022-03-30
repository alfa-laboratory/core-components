import { getOrCreateStyleTag } from '../utils';

import darkStyles from '!!postcss-loader!./dark.css';

export const MODES = ['light', 'dark'];
export const MODE_COLORS_TAG_ID = 'mode-colors';

export function setModeVarsInIframeHtmlPage() {
    const matches = /&mode=([^&]*)/.exec(document.location.search);

    if (matches) {
        setModeVars(matches[1], document);
    }
}

export function setModeVars(mode, doc) {
    const vars = mode === 'dark' ? darkStyles : '';

    getOrCreateStyleTag(MODE_COLORS_TAG_ID, null, doc).innerHTML = vars;
}
