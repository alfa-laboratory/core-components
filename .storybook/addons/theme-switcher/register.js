import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { Form } from '@storybook/components';
import { setStyles } from './utils';

export const ADDON_ID = 'theme-switcher';

const THEMES = [
    'default',
    'click',
    'corp',
    'mobile',
    'site',
    'intranet',
]

const Addon = () => {
    const [theme, setTheme] = useState('default');

    const handleChange = useCallback(event => {
        const newTheme = event.target.value;

        setTheme(newTheme);

        setStyles(newTheme);
    }, []);

    return (
        <div className='tool'>
            <span className='label'>Выбор темы: </span>
            <Form.Select size={1} onChange={handleChange} className='select' value={theme}>
                {THEMES.map(themeName => (
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
    });
});
