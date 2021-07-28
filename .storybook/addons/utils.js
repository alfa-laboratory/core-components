export const getStoryDoc = () => document.querySelector('iframe').contentDocument;

export function getOrCreateStyleTag(id, beforeId) {
    const storyDoc = getStoryDoc();

    const existingTag = storyDoc.getElementById(id);
    if (existingTag) {
        return existingTag;
    }

    const styleTag = storyDoc.createElement('style');
    styleTag.id = id;

    const before = storyDoc.getElementById(beforeId);

    if (before) {
        storyDoc.head.insertBefore(styleTag, before);
    } else {
        storyDoc.head.appendChild(styleTag);
    }

    return styleTag;
}

export const extractMixinContent = css =>
    css
        .trim()
        .split('\n')
        .slice(1, -1)
        .join('\n');
