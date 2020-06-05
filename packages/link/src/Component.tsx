import React, { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';
import cn from 'classnames';

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
    ({ view = 'primary', pseudo = false, className, dataTestId, children, ...restProps }, ref) => {
        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                {
                    [styles.pseudo]: pseudo,
                },
                className,
            ),
            'data-test-id': dataTestId,
        };

        return (
            <a {...componentProps} {...restProps} ref={ref}>
                {children}
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
