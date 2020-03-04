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
    decorators: [withDesign, withKnobs]
};

export const InputStory = () => {
    const [value, setValue] = useState('value');

    return (
        <Input
            size={ select('size', ['s', 'm', 'l'], 's') }
            type={ select('type', ['text', 'number', 'card', 'email', 'file', 'hidden', 'money', 'password', 'tel', 'text'], 'text') }
            disabled={ boolean('Disabled', false) }
            placeholder={ text('placeholder', '') }
            label={ text('label', '') }
            hint={ text('hint', '') }
            error={ text('error', '') }
            value={ value }
            onChange={ (e: any) => setValue(e.target.value) }
        />
    );
};

InputStory.story = {
    name: 'Input',
    parameters: {
        design: {
            type: 'figma',
            // public link for testing
            url: ''
        }
    }
};
