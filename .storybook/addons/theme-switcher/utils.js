import { getOrCreateStyleTag } from '../utils';
import { MODE_COLORS_TAG_ID } from '../mode-switcher/utils';

import bluetintColors from '!!postcss-loader!../../../packages/vars/src/colors-bluetint.css';

import click from '!!postcss-loader!./themes/click.css';
import mobile from '!!postcss-loader!./themes/mobile.css';
import corp from '!!postcss-loader!./themes/corp.css';
import site from '!!postcss-loader!./themes/site.css';
import intranet from '!!postcss-loader!./themes/intranet.css';

export const themes = {
    default: '',
    click,
    mobile,
    corp,
    site,
    intranet,
};

export const THEME_DATA_ATTR = 'theme';

export function setThemeStylesInIframeHtmlPage() {
    const matches = /&theme=([^&]*)/.exec(document.location.search);

    if (matches) {
        setStyles(matches[1], document);
    }
}

export function getThemeStyles(theme) {
    const bluetintThemes = ['mobile', 'intranet'];
    return [themes[theme], bluetintThemes.some(x => x.includes(theme)) ? bluetintColors : ''].join('\n');
}

export function setStyles(theme, doc) {
    getOrCreateStyleTag('theme', MODE_COLORS_TAG_ID, doc).innerHTML = getThemeStyles(theme);
}
