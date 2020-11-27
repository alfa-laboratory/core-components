import { useEffect, useCallback } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ADDON_ID, THEME_DATA_ATTR } from './register';

export default makeDecorator({
    name: 'withThemeSwitcher',
    wrapper: (getStory, context) => {
        const channel = addons.getChannel();

        const setTheme = useCallback(theme => {
            document.body.dataset[THEME_DATA_ATTR] = theme;
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
