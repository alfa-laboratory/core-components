export const colors = [
    'tertiary',
    'disabled',
    'accent',
    'primary',
    'attention',
    'positive',
    'secondary',
    'tertiary-inverted',
    'primary-inverted',
    'secondary-inverted',
    'link',
    'negative',
] as const;

export type Color = typeof colors[number];
