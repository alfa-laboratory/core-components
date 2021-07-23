// TODO: переписать

import React, { useCallback, useState } from 'react';
import { useChannel } from '@storybook/api';
import addons, { types } from '@storybook/addons';
import { STORY_RENDERED, DOCS_RENDERED } from '@storybook/core-events';
import { Form } from '@storybook/components';

import './index.css';

export const ADDON_ID = 'mode-switcher';
export const MODE_DATA_ATTR = 'mode';
const MODES = ['light', 'dark'];

const Addon = () => {
    const [mode, setMode] = useState(document.body.dataset[MODE_DATA_ATTR] || 'light');

    const emit = useChannel(
        {
            [STORY_RENDERED]: () => emit(`${ADDON_ID}/mode`, mode),
            [DOCS_RENDERED]: () => emit(`${ADDON_ID}/mode`, mode),
        },
        [mode],
    );

    const handleChange = useCallback(event => {
        const newMode = event.target.value;

        setMode(newMode);
        emit(`${ADDON_ID}/mode`, newMode);

        document.querySelector('iframe').contentDocument.body.dataset[MODE_DATA_ATTR] = newMode;
    }, []);

    return (
        <div className='tool' style={{ opacity: 0 }}>
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
