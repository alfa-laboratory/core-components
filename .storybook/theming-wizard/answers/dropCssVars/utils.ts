import { Answers } from ".storybook/theming-wizard/types";

export const withoutAruiScriptsExample = (answers: Answers) => {
    const settings: Record<string, any> = {
        preserve: false,
    };

    if (answers.product !== 'default') {
        settings.importFrom = `./node_modules/@alfalab/core-components/themes/${answers.product}.css`;
    }

    return `postcssCustomProperties(${JSON.stringify(settings, null, 4)})`;
};

export const aruiScriptsExample = (answers: Answers) => {
    return JSON.stringify(
        {
            keepCssVars: false,
            componentsTheme: `./node_modules/@alfalab/core-components/themes/${answers.product}.css`,
        },
        null,
        4,
    );
};

export const darkModeExample = (answers: Answers) => `
import darkMode from '@alfalab/core-components/themes/compiled/${answers.product}-dark-${
    answers.product === 'mobile' ? 'bluetint' : 'indigo'
}';

<>
    {mode === 'dark' && <style>{darkMode}</style>}
    {this.renderPage()}
</>
`;
