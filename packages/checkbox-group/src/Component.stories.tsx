import React, { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';

import { CheckboxGroup } from './Component';
import { Checkbox } from '../../checkbox/src';
import { Tag } from '../../tag/src';

export default {
    title: 'Common|CheckboxGroup',
    component: CheckboxGroup,
    decorators: [withDesign, withKnobs],
};

export const CheckboxStory = () => {
    const [value, setValue] = useState({ one: false, two: false, three: false });

    const onChange = (_, payload) => {
        setValue({ ...value, [payload.name]: payload.checked });
    };

    return (
        <CheckboxGroup label='Заголовок группы' onChange={onChange}>
            <Checkbox label='Первый вариант' name='one' checked={value.one} />

            <Checkbox label='Второй вариант' name='two' checked={value.two} />

            <Checkbox label='Третий вариант' name='three' checked={value.three} />
        </CheckboxGroup>
    );
};

export const CheckboxTagStory = () => {
    const [value, setValue] = useState({ one: false, two: false, three: false });

    const onChange = (_, payload) => {
        setValue({ ...value, [payload.name]: payload.checked });
    };

    return (
        <CheckboxGroup
            label='Заголовок группы'
            onChange={onChange}
            direction='horizontal'
            type='tag'
        >
            <Tag name='one' checked={value.one}>
                Первый вариант
            </Tag>

            <Tag name='one' checked={value.two}>
                Второй вариант
            </Tag>

            <Tag name='one' checked={value.three}>
                Третий вариант
            </Tag>
        </CheckboxGroup>
    );
};

CheckboxStory.story = {
    name: 'CheckboxGroup',
    parameters: {},
};

CheckboxTagStory.story = {
    name: 'CheckboxTagGroup',
    parameters: {},
};
