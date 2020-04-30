import React, { useState } from 'react';
import cn from 'classnames';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';

import { Checkbox } from './Component';
import styles from '../../../.storybook/styles.css';

export default {
    title: 'Common|Checkbox',
    component: Checkbox,
    decorators: [withDesign, withKnobs],
};

export const CheckboxStory = () => {
    const [value, setValue] = useState({ demo: false, hint: false, indeterminate: false });

    const onClick = (_, payload) => {
        setValue({ ...value, [payload.name]: payload.checked });
    };

    const disabled = boolean('disabled', false);

    return (
        <React.Fragment>
            <div className={cn(styles.row)} style={{ marginBottom: '20px' }}>
                <div className={cn(styles.col)}>
                    <Checkbox
                        disabled={disabled}
                        onChange={onClick}
                        checked={value.demo}
                        className='custom'
                        label='Согласен с условиями'
                        indeterminate={boolean('indeterminate', false)}
                        name='demo'
                    />
                </div>
            </div>

            <div className={cn(styles.row)} style={{ marginBottom: '20px' }}>
                <div className={cn(styles.col)}>
                    <Checkbox
                        onChange={onClick}
                        checked={value.hint}
                        className='custom'
                        label='Согласен с условиями'
                        hint='Мы будем присылать вам рассылку на почту каждый день'
                        name='hint'
                    />
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Checkbox
                        disabled={disabled}
                        onChange={onClick}
                        checked={value.indeterminate}
                        className='custom'
                        label='Выбраны не все услуги'
                        indeterminate={true}
                        name='indeterminate'
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

CheckboxStory.story = {
    name: 'Checkbox',
    parameters: {},
};
