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
    title: 'Common',
    component: Input,
    decorators: [withDesign, withKnobs],
};

// TODO: Этого не будет, когда появится компонент иконки.
const icon = (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9 1C4.588 1 1 4.588 1 9C1 13.412 4.588 17 9 17C13.412 17 17 13.412 17 9C17 4.588 13.412 1 9 1ZM9 15.933C7.1619 15.9309 5.3997 15.1998 4.09997 13.9C2.80024 12.6003 2.06912 10.8381 2.067 9C2.06912 7.1619 2.80024 5.3997 4.09997 4.09997C5.3997 2.80024 7.1619 2.06912 9 2.067C10.8381 2.06912 12.6003 2.80024 13.9 4.09997C15.1998 5.3997 15.9309 7.1619 15.933 9C15.9309 10.8381 15.1998 12.6003 13.9 13.9C12.6003 15.1998 10.8381 15.9309 9 15.933Z'
            fill='#0B1F35'
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M8.06692 5.47501C8.06692 5.95801 8.48792 6.35101 8.99592 6.35101C9.51292 6.35101 9.93292 5.95801 9.93292 5.47501C9.93292 5.00201 9.51192 4.60901 8.99592 4.60901C8.48792 4.60901 8.06592 5.00201 8.06592 5.47501H8.06692ZM8.46692 7.96901H9.53392V12.947H8.46692V7.96901Z'
            fill='#0B1F35'
        />
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
            rightAddons={boolean('withIcon', true) && !text('error', '') && icon}
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
