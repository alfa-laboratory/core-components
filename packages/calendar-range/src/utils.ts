export const isDayButton = (node: HTMLElement | null) =>
    node && node.tagName === 'BUTTON' && node.dataset.date;
