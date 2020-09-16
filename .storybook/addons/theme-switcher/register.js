import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { useChannel, useParameter } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';
import { Form } from '@storybook/components';

import './index.css';

export const ADDON_ID = 'theme-switcher';

const Addon = () => {
    const [theme, setTheme] = useState('default');
    const { themes } = useParameter(ADDON_ID, { themes: [] });

    const emit = useChannel({
        [STORY_RENDERED]: () => emit(`${ADDON_ID}/theme`, theme),
    });

    const handleChange = useCallback(event => {
        setTheme(event.target.value);
        emit(`${ADDON_ID}/theme`, event.target.value);
    }, []);

    return (
        themes.length > 0 && (
            <div className='tool'>
                <span className='label'>Theme:</span>
                <Form.Select size={1} onChange={handleChange} className='select'>
                    {['default'].concat(themes).map(themeName => (
                        <option value={themeName} key={themeName}>
                            {themeName}
                        </option>
                    ))}
                </Form.Select>
            </div>
        )
    );
};

addons.register(ADDON_ID, () => {
    addons.add(ADDON_ID, {
        type: types.TOOL,
        match: ({ viewMode }) => viewMode === 'story',
        render: () => <Addon />,
        paramKey: ADDON_ID,
    });
});
