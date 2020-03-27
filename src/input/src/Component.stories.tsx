/**
 * Vendor
 */

import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { withDesign } from 'storybook-addon-designs';

/**
 * Components
 */

import { Input } from './Component';

export default {
    title: 'Common|Input',
    component: Input,
    decorators: [withDesign, withKnobs],
};

// TODO: Этого не будет, когда появится компонент иконки.
const icon = (
    <svg width='18' height='18'>
        <path d='M9 1C4.588 1 1 4.588 1 9s3.588 8 8 8 8-3.588 8-8-3.588-8-8-8zm0 14.933A6.94 6.94 0 012.067 9 6.941 6.941 0 019 2.067 6.94 6.94 0 0115.933 9 6.94 6.94 0 019 15.933z' />
        <path d='M8.067 5.475c0 .483.42.876.929.876.517 0 .937-.393.937-.876 0-.473-.421-.866-.937-.866-.508 0-.93.393-.93.866zm.4 2.494h1.067v4.978H8.467V7.969z' />
    </svg>
);

export const InputStory = () => {
    const [value, setValue] = useState('value');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(event.target.value);

    return (
        <Input
            htmlType={select(
                'type',
                ['number', 'card', 'email', 'money', 'password', 'tel', 'text'],
                'text',
            )}
            block={boolean('block', false)}
            size={select('size', ['s', 'm', 'l'], 's')}
            disabled={boolean('disabled', false)}
            placeholder={text('placeholder', '')}
            label={text('label', '')}
            hint={text('hint', '')}
            error={text('error', '')}
            value={value}
            onChange={handleChange}
            rightAddons={boolean('rightAddons', true) && !text('error', '') && icon}
        />
    );
};

InputStory.story = {
    name: 'Input',
    parameters: {
        design: {
            type: 'figma',
            // public link for testing
            url: '',
        },
    },
};
