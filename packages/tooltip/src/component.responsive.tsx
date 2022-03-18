import React, { FC, Fragment } from 'react';
import { useMedia } from '@alfalab/hooks';

import { BottomSheet } from '@alfalab/core-components-bottom-sheet';
import { Button } from '@alfalab/core-components-button';

import { Tooltip, TooltipProps } from '.';

import styles from './responsive.module.css';

type View = 'desktop' | 'mobile';

type TooltipResponsiveProps = Omit<TooltipProps, 'open' | 'onClose' | 'onOpen'> & {
    /**
     * Режим отображения по умолчанию
     */
    defaultMatch?: View;

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
     * Заголовок кнопки в футере
     */
    actionButtonTitle?: string;

    /**
     * Наличие компонента крестика
     */
    hasCloser?: boolean;
};

export const TooltipResponsive: FC<TooltipResponsiveProps> = ({
    defaultMatch = 'mobile',
    content,
    children,
    onOpen,
    onClose,
    actionButtonTitle = 'Понятно',
    hasCloser,
    ...restProps
}) => {
    const [view] = useMedia<View>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        defaultMatch,
    );

    const handleOpen = () => {
        onOpen();
    };

    const handleClose = () => {
        onClose();
    }

    const isMobile = view === 'mobile';

    return isMobile ? (
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
            {/** TODO: проверить тултип на доступность */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={handleOpen} className={styles.target}>
                {children?.props.disabled && <div className={styles.overlap} />}
                {children}
            </div>
        </Fragment>
    ) : (
        <Tooltip {...restProps} content={content} onOpen={onOpen}>
            {children}
        </Tooltip>
    );
};
