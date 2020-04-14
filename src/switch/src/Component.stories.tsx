import React, { useState } from 'react';
import cn from 'classnames';

import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

import styles from '../../../.storybook/styles.css';

import { Switch } from './Component';

export default {
    title: 'Common|Switch',
    component: Switch,
    decorators: [withKnobs],
};

export const SwitchStory = () => {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <React.Fragment>
            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Switch
                        checked={checked}
                        disabled={boolean('Disabled', false)}
                        block={boolean('Block', false)}
                        contentAlign={select('contentAlign', ['left', 'right'], 'right')}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        label={text('text', 'Условие тоггла')}
                        hint={text('description', 'Описание пункта')}
                        name='switch'
                        value='value'
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Switch
                        checked={checked}
                        disabled={boolean('Disabled', false)}
                        block={boolean('Block', false)}
                        contentAlign={select('contentAlign', ['left', 'right'], 'right')}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        name='switch2'
                        value='value2'
                        onChange={handleChange}
                    >
                        <em>Custom content</em>
                    </Switch>
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Switch
                        checked={checked}
                        disabled={boolean('Disabled', false)}
                        block={boolean('Block', false)}
                        contentAlign={select('contentAlign', ['left', 'right'], 'right')}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        name='switch3'
                        value='value3'
                        onChange={handleChange}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

SwitchStory.story = {
    name: 'Switch',
    parameters: {},
};
