import React, { FC, useCallback, useContext } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import { ModalContext } from '../../Component';

import styles from './index.module.css';

export type CloserProps = {
    /**
     * Дополнительный класс
     */
    className?: string;
};

export const Closer: FC<CloserProps> = ({ className }) => {
    const { onClose } = useContext(ModalContext);

    const handleClick = useCallback(
        event => {
            onClose(event, 'closerClick');
        },
        [onClose],
    );

    return (
        <Button
            type='button'
            view='ghost'
            className={cn(styles.closer, className)}
            aria-label='закрыть'
            onClick={handleClick}
        />
    );
};
