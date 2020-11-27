import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { useChannel, useParameter } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';
import { Form } from '@storybook/components';

import './index.css';

export const ADDON_ID = 'theme-switcher';
export const THEME_DATA_ATTR = 'theme';

const Addon = () => {
    const [theme, setTheme] = useState(document.body.dataset[THEME_DATA_ATTR] || 'default');
    const { themes } = useParameter(ADDON_ID, { themes: [] });

    const emit = useChannel({
        [STORY_RENDERED]: () => emit(`${ADDON_ID}/theme`, theme),
    });

    const handleChange = useCallback(event => {
        const newTheme = event.target.value;

        setTheme(newTheme);
        emit(`${ADDON_ID}/theme`, newTheme);

        document.body.dataset[THEME_DATA_ATTR] = newTheme;
    }, []);

    return (
        themes.length > 0 && (
            <div className='tool'>
                <span className='label'>Theme:</span>
                <Form.Select size={1} onChange={handleChange} className='select' value={theme}>
                    {['default'].concat(themes).map(themeName => (
                        <option
                            value={themeName}
                            key={themeName}
                        >
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
