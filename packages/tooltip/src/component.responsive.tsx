import React, { FC, Fragment } from 'react';
import { useMedia } from '@alfalab/hooks';

import { BottomSheet, BottomSheetProps } from '@alfalab/core-components-bottom-sheet';

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
     * Кнопка в мобильной версии (обычно, это кнопка закрытия)
     */
    mobileActionButton?: BottomSheetProps['actionButton'];
};

export const TooltipResponsive: FC<TooltipResponsiveProps> = ({
    defaultMatch = 'mobile',
    content,
    children,
    mobileActionButton,
    onOpen,
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

    const isMobile = view === 'mobile';

    return isMobile ? (
        <Fragment>
            <BottomSheet {...restProps} actionButton={mobileActionButton}>
                {content}
            </BottomSheet>
            {/** TODO: проверить тултип на доступность */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={handleOpen} className={styles.target}>
                {children.props.disabled && <div className={styles.overlap} />}
                {children}
            </div>
        </Fragment>
    ) : (
        <Tooltip {...restProps} content={content} onOpen={onOpen}>
            {children}
        </Tooltip>
    );
};
