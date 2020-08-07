export const colors = [
    'tertiary',
    'disabled-transparent',
    'disabled',
    'accent',
    'tertiary-inverted-transparent',
    'primary',
    'secondary-transparent',
    'secondary-inverted-transparent',
    'attention',
    'positive',
    'secondary',
    'tertiary-inverted',
    'tertiary-transparent',
    'primary-inverted',
    'secondary-inverted',
    'link',
    'negative',
] as const;

export type Color = typeof colors[number];
