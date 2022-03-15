import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';
import { BaseModalContext } from '@alfalab/core-components-base-modal';
import { Typography } from '@alfalab/core-components-typography';

import { BottomSheetTitleAlign, HEADER_OFFSET } from '../..';
import { Closer } from '../closer/Components';

import styles from './index.module.css';
import { Backer } from '../backer/Components';

export type HeaderProps = {
    /**
     * Заголовок
     */
    title?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для аддонов
     */
    addonClassName?: string;

    /**
     * Дополнительный класс для компонента крестика
     */
    closerClassName?: string;

    /**
     * Дополнительный класс для компонента стрелки назад
     */
    backerClassName?: string;

    /**
     * Будет ли свайпаться шторка
     * @default true
     */
    swipeable?: boolean;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

    /**
     * Наличие компонента крестика
     */
    hasCloser?: boolean;

    /**
     * Наличие компонента стрелки назад
     */
    hasBacker?: boolean;

    /**
     * Выравнивание заголовка
     */
    titleAlign?: BottomSheetTitleAlign;

    /**
     * Будет ли обрезан заголовок
     */
    trimTitle?: boolean;

    /**
     * Фиксирует шапку
     */
    sticky?: boolean;

    /**
     * Обработчик нажатия на стрелку назад
     */
    onBack?: () => void;
};

export const Header: FC<HeaderProps> = ({
    title,
    className,
    addonClassName,
    closerClassName,
    backerClassName,
    swipeable,
    leftAddons,
    rightAddons,
    hasCloser,
    hasBacker,
    titleAlign,
    trimTitle,
    sticky,
    onBack,
}) => {
    const { headerHighlighted, setHasHeader, setHeaderOffset } = useContext(BaseModalContext);

    useEffect(() => {
        setHasHeader(true);
    }, [setHasHeader]);

    useEffect(() => {
        setHeaderOffset(HEADER_OFFSET);
    }, [setHeaderOffset]);

    return (
        <div
            className={cn(styles.header, className, {
                [styles.justifyEnd]: !title,
                [styles.highlighted]: headerHighlighted && sticky,
                [styles.sticky]: sticky,
            })}
        >
            {swipeable && <div className={cn(styles.marker)} />}

            {(hasBacker || leftAddons || titleAlign === 'center') && (
                <div className={cn(styles.addon, addonClassName)}>
                    {hasBacker ? (
                        <Backer className={backerClassName} onClick={onBack} />
                    ) : (
                        leftAddons
                    )}
                </div>
            )}

            {(title || hasBacker || hasCloser) && (
                <Typography.Text
                    view='primary-large'
                    weight='bold'
                    className={cn(styles.title, {
                        [styles.titleCenter]: titleAlign === 'center',
                        [styles.titleLeft]: titleAlign === 'left',
                        [styles.titleRight]: titleAlign === 'right',
                        [styles.trimTitle]: trimTitle,
                    })}
                    color='primary'
                >
                    {title}
                </Typography.Text>
            )}

            {(hasCloser || rightAddons || titleAlign === 'center') && (
                <div className={cn(styles.addon, addonClassName)}>
                    {hasCloser ? <Closer className={closerClassName} /> : rightAddons}
                </div>
            )}
        </div>
    );
};
