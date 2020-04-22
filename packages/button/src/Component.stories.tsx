import React from 'react';
import cn from 'classnames';

import { action } from '@storybook/addon-actions';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';

import Icon from '@alfalab/icons-glyph/StarMIcon';
import styles from '../../../.storybook/styles.css';

import { Button } from './Component';

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
                <Button view='secondary' leftAddons={<Icon />} size='m'>
                    Secondary
                </Button>
            </div>
        </div>
        <div className={cn(styles.row)}>
            <div className={cn(styles.col)}>
                <Button view='secondary' rightAddons={<Icon />} size='m' />
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
