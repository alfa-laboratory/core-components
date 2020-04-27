import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { withDesign } from 'storybook-addon-designs';
import cn from 'classnames';
import Icon from '@alfalab/icons-glyph/CopyMIcon';

import { Tag } from './Component';
import styles from '../../../.storybook/styles.css';

export default {
    title: 'Common|Tag',
    component: Tag,
    decorators: [withDesign, withKnobs],
};

export const TagStory = () => {
    const [value, setValue] = useState({ one: false, two: false, three: false, four: false });

    const onClick = (_, payload) => {
        setValue({ ...value, [payload.name]: payload.checked });
    };

    const size = select('size', ['xs', 's', 'm', 'l'], 'xs');
    const disabled = boolean('disabled', false);

    return (
        <React.Fragment>
            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Tag
                        size={size}
                        disabled={disabled}
                        onClick={onClick}
                        name='one'
                        checked={value.one}
                        className='custom'
                    >
                        Нажми меня
                    </Tag>
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Tag
                        size='s'
                        onClick={onClick}
                        name='two'
                        checked={value.two}
                        className={cn(styles.tag, { checked: value[1] })}
                        rightAddons={<Icon />}
                    >
                        Нажми меня
                    </Tag>
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Tag
                        size='m'
                        onClick={onClick}
                        name='three'
                        checked={value.three}
                        leftAddons={<Icon />}
                    >
                        Нажми меня
                    </Tag>
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Tag size='l' onClick={onClick} checked={value.four} name='four'>
                        Нажми меня
                    </Tag>
                </div>
            </div>
        </React.Fragment>
    );
};

TagStory.story = {
    name: 'Tag',
    parameters: {
        design: {
            type: 'figma',
            // public link for testing
            url: '',
        },
    },
};
