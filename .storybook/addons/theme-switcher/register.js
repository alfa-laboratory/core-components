import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { useChannel, useParameter } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';
import { Form } from '@storybook/components';

import './index.css';

export const ADDON_ID = 'theme-switcher';
export const THEMES = ['default', 'click', 'site', 'corp', 'mobile'];

const Addon = () => {
    const [theme, setTheme] = useState('default');
    const { enabled } = useParameter(ADDON_ID, { enabled: false });

    const emit = useChannel({
        [STORY_RENDERED]: () => emit(`${ADDON_ID}/theme`, theme),
    });

    const handleChange = useCallback(event => {
        setTheme(event.target.value);
        emit(`${ADDON_ID}/theme`, event.target.value);
    }, []);

    return (
        enabled && (
            <div className='tool'>
                <Form.Select size={1} onChange={handleChange} className='select'>
                    {THEMES.map(themeName => (
                        <option value={themeName} key={themeName}>
                            Тема: {themeName}
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
