import React, { useState } from 'react';
import cn from 'classnames';

import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import styles from '../../../.storybook/styles.css';

import { Switch } from './Component';
import { Button } from '../../button/src';

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
                        disabled={boolean('disabled', false)}
                        reversed={boolean('reversed', false)}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        label={text('label', 'Условие тоггла')}
                        hint={text('hint', 'Описание пункта')}
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
                        disabled={boolean('disabled', false)}
                        reversed={boolean('reversed', false)}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        name='switch3'
                        value='value3'
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Switch
                        checked={checked}
                        disabled={boolean('disabled', false)}
                        reversed={boolean('reversed', false)}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        name='switch3'
                        value='value3'
                        label='Согласен'
                        hint={
                            <span>
                                вы соглашаетесь с <Button view='ghost'>условиями</Button>
                            </span>
                        }
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Switch
                        checked={checked}
                        disabled={boolean('disabled', false)}
                        reversed={true}
                        className={text('className', '')}
                        dataTestId={text('dataTestId', '')}
                        name='switch3'
                        value='value3'
                        label='reversed'
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
