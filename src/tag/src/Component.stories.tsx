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
    const [value, setValue] = useState([false, false, false]);

    const onClick = (index: number) => {
        const newValue = value.slice();
        newValue[index] = !newValue[index];
        setValue(newValue);
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
                        onClick={() => onClick(0)}
                        checked={value[0]}
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
                        onClick={() => onClick(1)}
                        checked={value[1]}
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
                        onClick={() => onClick(2)}
                        checked={value[2]}
                        leftAddons={<Icon />}
                    >
                        Нажми меня
                    </Tag>
                </div>
            </div>

            <div className={cn(styles.row)}>
                <div className={cn(styles.col)}>
                    <Tag size='l' onClick={() => onClick(3)} checked={value[3]}>
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
