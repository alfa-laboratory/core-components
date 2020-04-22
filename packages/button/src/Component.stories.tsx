import React from 'react';
import cn from 'classnames';

import { action } from '@storybook/addon-actions';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';

import styles from '../../../.storybook/styles.css';

import { Button } from './Component';

const icon = (
    <svg width='24' height='24' fill='currentColor'>
        <path d='M11.511 2.327a.528.528 0 01.978 0L15 8.967h6.474c.498 0 .716.619.325.923L16.5 14l2 7c.121.462-.403.825-.804.557L12 17.133l-5.696 4.424c-.4.268-.925-.095-.804-.557l2-7-5.299-4.11c-.391-.304-.173-.923.325-.923H9l2.511-6.64z' />
    </svg>
);

export default {
    title: 'Common|Button',
    component: Button,
    decorators: [withKnobs],
};

export const ButtonStory = () => (
    <React.Fragment>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button
                    view={select(
                        'View',
                        ['primary', 'secondary', 'outlined', 'link', 'ghost'],
                        'primary',
                    )}
                    title={text('Title', '')}
                    disabled={boolean('Disabled', false)}
                    type={select('type', ['button', 'reset', 'submit'], 'button')}
                    href={text('href', '')}
                    size={select('Size', ['xs', 's', 'm', 'l'], 'm')}
                    block={boolean('Block', false)}
                    className={text('className', '')}
                    dataTestId={text('dataTestId', '')}
                    onClick={action('click')}
                >
                    {text('Label', 'Primary')}
                </Button>
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='secondary' leftAddons={icon} size='m'>
                    Secondary
                </Button>
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='secondary' rightAddons={icon} size='m' />
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='outlined' size='m'>
                    Outlined
                </Button>
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='link' size='m'>
                    Link
                </Button>
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='ghost' size='m'>
                    Ghost
                </Button>
            </div>
        </div>
    </React.Fragment>
);

ButtonStory.story = {
    name: 'Button',
    parameters: {},
};
