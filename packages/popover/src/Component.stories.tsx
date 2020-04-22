import React, { useState, useRef } from 'react';

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

    const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

    const toggle = () => {
        setOpen(!open);
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
                anchorElement={buttonRef.current}
                position={select('position', POSITION_OPTIONS, 'bottom') as Position}
                open={open}
                transition={{ timeout: 0 }}
                offset={{ x: number('offset.x', 0), y: number('offset.y', 0) }}
                withArrow={boolean('withArrow', false)}
            >
                <div style={{ padding: '15px', width: '156px' }}>I am popover</div>
            </Popover>

            <Button ref={buttonRef} onClick={toggle}>
                Show/Hide popover
            </Button>
        </div>
    );
};

Basic.story = {
    name: 'Popover',
};
