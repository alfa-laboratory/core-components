export type Question = {
    name: 'product' | 'keepCssVars' | 'darkMode' | 'aruiScripts' | 'ie';
    title: string;
    variants: Array<{ label: string; value: string }>;
};

export type Answers = Record<Question['name'], Answer>;

export type Answer = string;
