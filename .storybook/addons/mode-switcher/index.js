import React from 'react';
import { useEffect, useState } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ADDON_ID } from './register';
import { DarkThemeStylesInjector } from '../../../packages/dark-theme-styles-injector/src/index';

export default makeDecorator({
    name: 'withModeSwitcher',
    wrapper: (getStory, context) => {
        const [mode, setMode] = useState('light');
        const channel = addons.getChannel();

        useEffect(() => {
            channel.on(`${ADDON_ID}/mode`, setMode);

            return () => {
                channel.removeListener(`${ADDON_ID}/mode`, setMode);
            };
        }, [channel]);

        console.log(mode);

        return (
            <>
                {mode === 'dark' && <DarkThemeStylesInjector colors='indigo' />}
                {getStory(context)}
            </>
        );
    },
});
