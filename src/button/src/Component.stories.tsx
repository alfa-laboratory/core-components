/**
 * Vendor
 */

import React from 'react';

import { action } from '@storybook/addon-actions';
import { withDesign } from 'storybook-addon-designs';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';

/**
 * Components
 */

import { Button } from './Component';

export default {
    title: 'Common',
    component: Button,
    decorators: [withDesign, withKnobs],
};

export const ButtonStory = () => (
    <Button
        type={select('Type', ['primary', 'secondary', 'extra', 'dashed', 'link'], 'primary')}
        title={text('Title', '')}
        disabled={boolean('Disabled', false)}
        htmlType={select('htmlType', ['button', 'reset', 'submit'], 'button')}
        loading={boolean('Loading', false)}
        size={select('Size', ['xs', 's', 'm', 'l'], 'm')}
        block={boolean('Block', false)}
        className={text('className', '')}
        dataTestId={text('dataTestId', '')}
        onClick={action('click')}
    >
        {text('Label', 'Оплатить')}
    </Button>
);

ButtonStory.story = {
    name: 'Button',
    parameters: {
        design: {
            type: 'figma',
            // public link for testing
            url: 'https://www.figma.com/file/cgApcObBwfNQzVVzJNqxoQ/Button',
        },
    },
};
