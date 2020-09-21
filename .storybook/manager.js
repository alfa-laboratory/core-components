import { addons } from '@storybook/addons';
import alfaTheme from './theme';

import { STORY_RENDERED } from '@storybook/core-events';

addons.register('TitleAddon', api => {
    const customTitle = 'Core Components';
    let interval = null;
    const setTitle = () => {
        clearTimeout(interval);
        let storyData = null;
        try {
            storyData = api.getCurrentStoryData();
        } catch (e) {}
        let title;
        if (!storyData) {
            title = customTitle;
        } else {
            let kind, name;

            kind = storyData.kind.replace('|', ' – ');
            name = storyData.name;
            name = name === 'Page' ? '' : ` – ${name}`;

            title = `${kind}${name} ⋅ ${customTitle}`;
        }
        if (document.title !== title) {
            document.title = title;
        }
        interval = setTimeout(setTitle, 100);
    };
    setTitle();
    api.on(STORY_RENDERED, story => {
        setTitle();
    });
});

addons.setConfig({
    theme: alfaTheme,
    sortStoriesByKind: false,
});
