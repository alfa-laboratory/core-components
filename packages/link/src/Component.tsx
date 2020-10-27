import React, { AnchorHTMLAttributes, forwardRef, ReactNode, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type LinkProps = NativeProps & {
    /**
     * URL для перехода (native prop)
     */
    href?: string;

    /**
     * Тип ссылки
     */
    view?: 'primary' | 'secondary' | 'default';

    /**
     * Пунктирное подчеркивание
     */
    pseudo?: boolean;

    /**
     * Слот слева
     */
    leftSlot?: React.ReactNode;

    /**
     * Слот справа
     */
    rightSlot?: React.ReactNode;

    /**
     * Дополнительный класс (native prop)
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Обработчик нажатия (native prop)
     */
    onClick?: NativeProps['onClick'];

    /**
     * Дочерние элементы (native prop)
     */
    children: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            view = 'primary',
            pseudo = false,
            leftSlot,
            rightSlot,
            className,
            dataTestId,
            children,
            ...restProps
        },
        ref,
    ) => {
        const linkRef = useRef<HTMLAnchorElement>(null);

        const [focused] = useFocus(linkRef, 'keyboard');

        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                {
                    [styles.pseudo]: pseudo,
                    [styles.focused]: focused,
                },
                className,
            ),
            'data-test-id': dataTestId,
        };

        const linkChildren = (
            <React.Fragment>
                {leftSlot && <span className={cn(styles.slots)}>{leftSlot}</span>}
                {children && <span className={cn(styles.link)}>{children}</span>}
                {rightSlot && <span className={cn(styles.slots)}>{rightSlot}</span>}
            </React.Fragment>
        );

        return (
            <a {...componentProps} {...restProps} ref={mergeRefs([linkRef, ref])}>
                {linkChildren}
            </a>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Link.defaultProps = {
    view: 'primary',
    pseudo: false,
};
