import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { useParameter } from '@storybook/api';
import { Form } from '@storybook/components';
import { getTheme, setThemeAttr } from './utils';

export const ADDON_ID = 'theme-switcher';

const Addon = () => {
    const [theme, setTheme] = useState(getTheme() || 'default');
    const { themes } = useParameter(ADDON_ID, { themes: [] });

    const handleChange = useCallback(event => {
        const newTheme = event.target.value;

        setTheme(newTheme);
        setThemeAttr(newTheme);
    }, []);

    if (!themes.length) return null;

    return (
        <div className='tool'>
            <span className='label'>Выбор темы: </span>
            <Form.Select size={1} onChange={handleChange} className='select' value={theme}>
                {['default'].concat(themes).map(themeName => (
                    <option value={themeName} key={themeName}>
                        {themeName}
                    </option>
                ))}
            </Form.Select>
        </div>
    );
};

addons.register(ADDON_ID, () => {
    addons.add(ADDON_ID, {
        type: types.TOOL,
        match: () => true,
        render: () => <Addon />,
        paramKey: ADDON_ID,
    });
});
