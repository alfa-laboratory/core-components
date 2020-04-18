import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import { Button } from '../../button/src';
import { Portal } from './index';

export default {
    title: 'Common|Portal',
    component: Portal,
    decorators: [withKnobs],
};

export const Basic = () => {
    const [show, setShow] = React.useState(false);

    const handleClick = () => {
        setShow(!show);
    };

    return (
        <div>
            <Button onClick={handleClick}>{show ? 'Unmount children' : 'Mount children'}</Button>
            <div style={{ marginBottom: '200px' }}>
                It looks like I will render here.
                {show ? (
                    <Portal>
                        <span>But I actually render here!</span>
                    </Portal>
                ) : null}
            </div>
        </div>
    );
};

Basic.story = {
    name: 'Portal',
};
