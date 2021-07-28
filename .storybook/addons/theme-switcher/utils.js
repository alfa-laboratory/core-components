import bluetintColors from '!!postcss-loader!../../../packages/vars/src/colors-bluetint.css';

export const THEME_DATA_ATTR = 'theme';

export const getStoryDoc = () => document.querySelector('iframe').contentDocument;

export function getTheme() {
    try {
        return doc.body.dataset[THEME_DATA_ATTR];
    } catch (e) {
        return null;
    }
}

export function setThemeAttr(theme) {
    getStoryDoc().body.dataset[THEME_DATA_ATTR] = theme;

    handleColorsPalette(theme);
}

function handleColorsPalette(theme) {
    const tagId = 'mobile-styles';

    const doc = getStoryDoc();
    const existingStyleTag = doc.getElementById(tagId);

    if (theme === 'mobile' && !existingStyleTag) {
        const style = doc.createElement('style');
        style.id = tagId;
        style.innerHTML = bluetintColors;

        doc.head.appendChild(style);
    }

    if (theme !== 'mobile' && existingStyleTag) {
        existingStyleTag.remove();
    }
}
