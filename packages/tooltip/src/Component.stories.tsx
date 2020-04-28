import React from 'react';
import { withKnobs, select, number } from '@storybook/addon-knobs';

import { Tooltip } from './Component';
import { Position } from '../../popover/src';

export default {
    title: 'Common|Tooltip',
    component: Tooltip,
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

export const TooltipStory = () => {
    const openSelectValue = select('open', ['true', 'false', 'undefined'], 'undefined');

    const open =
        /* eslint-disable-next-line no-nested-ternary */
        openSelectValue === 'false' ? false : openSelectValue === 'true' ? true : undefined;

    const trigger = select('trigger', ['hover', 'click'], 'hover');

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
            <Tooltip
                content={
                    <div style={{ width: '215px' }}>
                        Теперь вам можно снимать наличные в кассе и банкоматах, если ваш тариф это
                        позволяет
                    </div>
                }
                open={open}
                trigger={trigger}
                offset={[number('offset[0]', 0), number('offset[1]', 10)]}
                position={select('position', POSITION_OPTIONS, 'left') as Position}
                onCloseDelay={number('onCloseDelay (in ms)', 300)}
                onOpenDelay={number('onOpenDelay (in ms)', 300)}
                dataTestId='test-id'
            >
                <div style={{ padding: '15px', border: '1px dashed rgba(0, 0, 0, 0.1)' }}>
                    {trigger === 'hover' ? 'Hover me' : 'Click me'}
                </div>
            </Tooltip>
        </div>
    );
};

TooltipStory.story = {
    name: 'Tooltip',
    parameters: {},
};
