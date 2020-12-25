import React from 'react';
import cn from 'classnames';

import { Fade } from '../fade';

import { ComponentTransitionsProps } from '../../utils';

import style from './index.module.css';

export type BackdropProps = {
    invisible?: boolean;
    open: boolean;
    onClick?: () => void;
} & ComponentTransitionsProps;

export const Backdrop: React.FC<BackdropProps> = ({
    open,
    invisible = false,
    children,
    onClick,
    ...other
}) => (
    <Fade show={open} {...other}>
        <div
            data-test-id='Backdrop'
            aria-hidden={true}
            onClick={onClick}
            className={cn(style.backdrop, {
                [style.invisible]: invisible,
            })}
        />
    </Fade>
);
