import React, { Fragment, ReactNode } from 'react'
import { BottomSheet } from '@alfalab/core-components-bottom-sheet';

import { Button } from '../../button/src/Component';
import { TooltipProps } from './Component'

import styles from './mobile.module.css';

type TooltipMobileActionButtonTitleType = 'Понятно' | 'Закрыть' | 'Хорошо';

type TooltipMobileProps = TooltipProps & {
    /**
     * Управление видимостью
     */
    open: boolean;

    /**
     * Обработчик открытия
     */
    onOpen: () => void;

    /**
     * Обработчик закрытия
     */
    onClose: () => void;

    /**
     * Контент тултипа
     */
    content: ReactNode;

    /**
     * Заголовок кнопки в футере
     */
    actionButtonTitle?: TooltipMobileActionButtonTitleType;

    /**
     * Наличие компонента крестика
     */
    hasCloser?: boolean;
}


export const TooltipMobile: React.FC<TooltipMobileProps> = ({
    children,
    content,
    onOpen,
    onClose,
    actionButtonTitle = 'Понятно',
    hasCloser,
    ...restProps
}) => {
    const handleOpen = () => {
        onOpen();
    };
    
    const handleClose = () => {
        onClose();
    }

    return (
        <Fragment>
            <BottomSheet
                {...restProps}
                onClose={handleClose}
                hasCloser={hasCloser}
                actionButton={
                    <Button view='secondary' block={true} size='s' onClick={handleClose}>
                        {actionButtonTitle}
                    </Button>
                }
            >
                {content}
            </BottomSheet>
            <div onClick={handleOpen} className={styles.target}>
                {children.props.disabled && <div className={styles.overlap} />}
                {children}
            </div>
        </Fragment>
    )
}
