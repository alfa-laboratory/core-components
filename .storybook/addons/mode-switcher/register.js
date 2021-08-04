import React, { useCallback, useState } from 'react';
import addons, { types } from '@storybook/addons';
import { Form } from '@storybook/components';
import { setModeVars, MODES } from './utils';

export const ADDON_ID = 'mode-switcher';

const Addon = () => {
    const [mode, setMode] = useState('light');

    const handleChange = useCallback(event => {
        const newMode = event.target.value;

        setMode(newMode);

        setModeVars(newMode);
    }, []);

    return (
        <div className='tool'>
            <Form.Select size={1} onChange={handleChange} className='select' value={mode}>
                {MODES.map(mode => (
                    <option value={mode} key={mode}>
                        {mode}
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
