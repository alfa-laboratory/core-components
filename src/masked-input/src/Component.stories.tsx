/**
 * Vendor
 */

import React, { useState } from 'react';

import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';

/**
 * Components
 */

import { MaskedInput, DEFAULT_PLACEHOLDER_CHAR } from './Component';

export default {
    title: 'Common|MaskedInput',
    component: MaskedInput,
    decorators: [withKnobs],
};

type Masks = 'phone' | 'card';

export const MaskedInputStory = () => {
    const [value, setValue] = useState('');

    // prettier-ignore
    const masks: { [key in Masks]: Array<string | RegExp> } = {
        phone: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
        card: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    };

    const placeholders: { [key in Masks]: string } = {
        phone: '+7 (000) 000-00-00',
        card: '0000-0000-0000-0000',
    };

    const selected = select('mask', Object.keys(masks), 'phone') as Masks;

    const mask = masks[selected];
    const placeholder = placeholders[selected];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value);
    };

    return (
        <div>
            <MaskedInput
                mask={mask}
                guide={boolean('guide', false)}
                placeholderChar={text('placeholderChar', DEFAULT_PLACEHOLDER_CHAR)}
                keepCharPositions={boolean('keepCharPositions', true)}
                showMask={boolean('showMask', false)}
                type={select(
                    'type',
                    ['number', 'card', 'email', 'money', 'password', 'tel', 'text'],
                    'text',
                )}
                block={boolean('block', false)}
                size={select('size', ['s', 'm', 'l'], 's')}
                disabled={boolean('disabled', false)}
                placeholder={placeholder}
                label={text('label', '')}
                hint={text('hint', '')}
                error={text('error', '')}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

MaskedInputStory.story = {
    name: 'MaskedInput',
    parameters: {},
};
