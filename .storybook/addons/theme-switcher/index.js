import React, { useState, useEffect } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ADDON_ID } from './register';

import styles from './index.css';

export default makeDecorator({
    name: 'withThemeSwitcher',
    wrapper: (getStory, context) => {
        const [theme, setTheme] = useState();

        const channel = addons.getChannel();

        useEffect(() => {
            channel.on(`${ADDON_ID}/theme`, setTheme);

            return () => {
                channel.removeListener(`${ADDON_ID}/theme`, setTheme);
            };
        }, []);

        return <div className={styles[theme]}>{getStory(context)}</div>;
    },
});
