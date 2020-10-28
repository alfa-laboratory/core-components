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
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

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
            leftAddons,
            rightAddons,
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

        return (
            <a {...componentProps} {...restProps} ref={mergeRefs([linkRef, ref])}>
                {leftAddons && <span className={cn(styles.addons)}>{leftAddons}</span>}
                {children && <span className={cn(styles.link)}>{children}</span>}
                {rightAddons && <span className={cn(styles.addons)}>{rightAddons}</span>}
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
