import indigoDark from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-indigo.css';
import bluetintDark from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-bluetint.css';
import darkStyles from '!!raw-loader!./dark.css';

export const STYLE_TAG_ID = 'colors-override';
export const MODES = ['light', 'dark'];

export const getStoryDoc = () => document.querySelector('iframe').contentDocument;

export const darkColorsMap = {
    indigo: innerCss(indigoDark),
    bluetint: innerCss(bluetintDark),
};

export function setModeVars(mode) {
    const styleTag = getColorsStyleTag();

    styleTag.innerHTML =
        mode === 'dark' ? `:root { ${darkColorsMap['indigo']} }\n${darkStyles}` : '';
}

export function getColorsStyleTag() {
    const storyDoc = getStoryDoc();

    const existingTag = storyDoc.getElementById(STYLE_TAG_ID);
    if (existingTag) {
        return existingTag;
    }

    const styleTag = storyDoc.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    storyDoc.head.appendChild(styleTag);

    return styleTag;
}

function innerCss(css) {
    return css
        .trim()
        .split('\n')
        .slice(1, -1)
        .join('\n');
}
