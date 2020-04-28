import React, { useState } from 'react';

import { withKnobs, select, number, boolean } from '@storybook/addon-knobs';
import { Popover, Position } from './index';
import { Button } from '../../button/src';

export default {
    title: 'Common|Popover',
    component: Popover,
    decorators: [withKnobs],
};

const POSITION_OPTIONS = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
    'left',
    'left-start',
    'left-end',
];

export const Basic = () => {
    const [open, setOpen] = useState(false);
    const [buttonElement, setButtonElement] = useState(null);

    const toggle = () => {
        setOpen(!open);
    };

    const handleButtonRef = node => {
        setButtonElement(node);
    };

    return (
        <div
            style={{
                width: '700px',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Popover
                anchorElement={buttonElement}
                position={select('position', POSITION_OPTIONS, 'bottom') as Position}
                open={open}
                transition={{ timeout: 0 }}
                offset={[number('offset[0]', 0), number('offset[1]', 0)]}
                withArrow={boolean('withArrow', false)}
            >
                <div style={{ padding: '15px', width: '156px' }}>I am popover</div>
            </Popover>

            <Button ref={handleButtonRef} onClick={toggle}>
                Show/Hide popover
            </Button>
        </div>
    );
};

Basic.story = {
    name: 'Popover',
};
