import React from 'react';
import { useEffect, useState } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ADDON_ID } from './register';

import colorsIndigo from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-indigo.css';
import colorsBluetint from '!!raw-loader!../../../packages/themes/src/mixins/colors/colors-bluetint.css';

import './index.css';

const innerCss = (css) => css.trim().split('\n').slice(1, -1).join('\n');

const colorsMap = {
    indigo: innerCss(colorsIndigo),
    bluetint: innerCss(colorsBluetint),
};

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
                {mode === 'dark' && <style id='test'>{`:root { ${colorsMap['indigo']} }`}</style>}
                {getStory(context)}
            </>
        );
    },
});
