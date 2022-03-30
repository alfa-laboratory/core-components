import React, { FC, MutableRefObject } from 'react';

import { IconButton, IconButtonProps } from '@alfalab/core-components-icon-button';
import { Tooltip } from '@alfalab/core-components-tooltip';

import { PointerDownMIcon } from '@alfalab/icons-glyph/PointerDownMIcon';
import { ArrowsOutwardMIcon } from '@alfalab/icons-glyph/ArrowsOutwardMIcon';
import { ArrowsInwardMIcon } from '@alfalab/icons-glyph/ArrowsInwardMIcon';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';

type Props = Omit<IconButtonProps, 'icon' | 'colors'> & {
    buttonRef?: MutableRefObject<HTMLButtonElement | null>;
    download?: string | boolean;
};

export const Fullscreen: FC<Props> = ({ buttonRef, ...restProps }) => (
    <Tooltip
        trigger='hover'
        position='bottom'
        content='Открыть в полноэкранном режиме'
        fallbackPlacements={['bottom-end']}
    >
        <IconButton
            {...restProps}
            ref={buttonRef}
            icon={ArrowsOutwardMIcon}
            colors='inverted'
            aria-label='Открыть в полноэкранном режиме'
        />
    </Tooltip>
);

export const ExitFullscreen: FC<Props> = ({ buttonRef, ...restProps }) => (
    <Tooltip
        trigger='hover'
        position='bottom'
        content='Выйти из полноэкранного режима'
        fallbackPlacements={['bottom-end']}
    >
        <IconButton
            {...restProps}
            ref={buttonRef}
            icon={ArrowsInwardMIcon}
            colors='inverted'
            aria-label='Выйти из полноэкранного режима'
        />
    </Tooltip>
);

export const Download: FC<Props> = props => (
    <Tooltip
        trigger='hover'
        position='bottom'
        content='Скачать'
        fallbackPlacements={['bottom-end']}
    >
        <IconButton {...props} icon={PointerDownMIcon} colors='inverted' aria-label='Скачать' />
    </Tooltip>
);

export const Exit: FC<Props> = props => (
    <IconButton {...props} icon={CrossMIcon} colors='inverted' aria-label='Закрыть' />
);
