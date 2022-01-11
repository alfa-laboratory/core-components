export const getStoryDoc = () => document.querySelector('iframe').contentDocument;

export function getOrCreateStyleTag(id, beforeId, doc = getStoryDoc()) {
    const existingTag = doc.getElementById(id);
    if (existingTag) {
        return existingTag;
    }

    const styleTag = doc.createElement('style');
    styleTag.id = id;

    const before = beforeId ? doc.getElementById(beforeId) : null;

    if (before) {
        doc.head.insertBefore(styleTag, before);
    } else {
        doc.head.appendChild(styleTag);
    }

    return styleTag;
}

export function setGuidelinesStyles(styles) {
    getOrCreateStyleTag('guidelines', null, document).innerHTML = styles;
}

export const extractMixinContent = css =>
    css
        .trim()
        .split('\n')
        .slice(1, -1)
        .join('\n');
