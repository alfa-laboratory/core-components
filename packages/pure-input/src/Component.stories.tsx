import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { withDesign } from 'storybook-addon-designs';

import { PureInput } from './Component';

export default {
    title: 'Common|PureInput',
    component: PureInput,
    decorators: [withDesign, withKnobs],
};

export const PureInputStory = () => {
    const [value, setValue] = useState('value');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(event.target.value);

    return (
        <PureInput
            size={select('size', ['s', 'm', 'l'], 's')}
            type={select(
                'type',
                ['number', 'card', 'email', 'hidden', 'money', 'password', 'tel', 'text'],
                'text',
            )}
            block={boolean('block', false)}
            disabled={boolean('disabled', false)}
            placeholder={text('placeholder', '')}
            value={value}
            onChange={handleChange}
        />
    );
};

PureInputStory.story = {
    name: 'PureInput',
    parameters: {
        design: {
            type: 'figma',
            // public link for testing
            url: '',
        },
    },
};
