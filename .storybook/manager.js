import { addons } from '@storybook/addons';
import alfaTheme from './theme';

import { STORY_RENDERED } from '@storybook/core-events';

import '../packages/themes/src/default.css';

addons.register('TitleAddon', api => {
    const libName = 'Core Components';
    let interval = null;
    const setTitle = () => {
        clearTimeout(interval);
        let storyData = null;
        try {
            storyData = api.getCurrentStoryData();
        } catch (e) {}
        let title;
        if (!storyData) {
            title = libName;
        } else {
            let kind = storyData.kind;
            kind = kind.replace('Компоненты/', '').replace('Гайдлайны/', '');
            kind = kind.includes('|') ? kind.match(/\|(.*)/)[1] : kind;

            let name = storyData.name;
            name = name === 'Page' ? '' : name;

            let storyTitle = kind || name;

            title = `${storyTitle} ⋅ ${libName}`;
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
});
