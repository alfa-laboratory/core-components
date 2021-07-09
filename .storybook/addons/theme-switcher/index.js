import { useEffect, useCallback } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ADDON_ID, THEME_DATA_ATTR } from './register';

// Создает style-тэг с bluetint цветами для мобильной темы
const handleThemeColors = theme => {
    const tagId = 'mobile-styles';

    const existingStyleTag = document.getElementById(tagId);

    if (theme === 'mobile' && !existingStyleTag) {
        import(`!!raw-loader!../../../packages/vars/src/colors-bluetint.css`).then(module => {
            const style = document.createElement('style');
            style.id = 'mobile-styles';
            style.innerHTML = module.default;

            document.head.appendChild(style);
        });
    }

    if (theme !== 'mobile' && existingStyleTag) {
        existingStyleTag.remove();
    }
};

export default makeDecorator({
    name: 'withThemeSwitcher',
    wrapper: (getStory, context) => {
        const channel = addons.getChannel();

        const setTheme = useCallback(theme => {
            document.body.dataset[THEME_DATA_ATTR] = theme;

            handleThemeColors(theme);
        }, []);

        useEffect(() => {
            channel.on(`${ADDON_ID}/theme`, setTheme);

            return () => {
                channel.removeListener(`${ADDON_ID}/theme`, setTheme);
            };
        }, [channel, setTheme]);

        return getStory(context);
    },
});
