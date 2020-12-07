import React from 'react';
import cn from 'classnames';

import { Fade } from '@alfalab/core-components-fade';

import { ComponentTransitionsProps } from './utils';

import style from './index.module.css';

export type SimpleBackdropProps = {
    invisible?: boolean;
    open: boolean;
    onClick?: () => void;
} & ComponentTransitionsProps;

export const SimpleBackdrop: React.FC<SimpleBackdropProps> = ({
    open,
    invisible = false,
    children,
    onClick,
    ...other
}) => (
    <Fade show={open} {...other}>
        <div
            data-test-id="Backdrop"
            aria-hidden={true}
            onClick={onClick}
            className={cn(style['simple-backdrop'], {
                [style['simple-backdrop_invisible']]: invisible,
            })}
        />
    </Fade>
);
