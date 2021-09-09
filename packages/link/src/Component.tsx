import React, { AnchorHTMLAttributes, ElementType, forwardRef, ReactNode, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

const colorStyles = {
    default: defaultColors,
    inverted: invertedColors,
};

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
    leftAddons?: ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

    /**
     * Позволяет использовать кастомный компонент для кнопки (например Link из роутера)
     */
    Component?: ElementType;

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

    /**
     * Набор цветов для компонента
     */
    colors?: 'default' | 'inverted';
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
            colors = 'default',
            href,
            Component = 'a',
            ...restProps
        },
        ref,
    ) => {
        const linkRef = useRef<HTMLAnchorElement>(null);

        const [focused] = useFocus(linkRef, 'keyboard');

        const componentProps = {
            className: cn(
                styles.component,
                colorStyles[colors][view],
                {
                    [styles.pseudo]: pseudo,
                    [styles.focused]: focused,
                    [styles.withAddons]: leftAddons || rightAddons,
                },
                className,
            ),
            'data-test-id': dataTestId,
            rel: restProps.target === '_blank' ? 'noreferrer noopener' : undefined,
            // Для совместимости с react-router-dom, меняем href на to
            [typeof Component === 'string' ? 'href' : 'to']: href,
        };

        return (
            <Component {...componentProps} {...restProps} ref={mergeRefs([linkRef, ref])}>
                {leftAddons || rightAddons ? (
                    <React.Fragment>
                        {leftAddons && <span className={styles.addons}>{leftAddons}</span>}
                        {children && (
                            <span>
                                <span className={styles.text}>{children}</span>
                            </span>
                        )}
                        {rightAddons && <span className={styles.addons}>{rightAddons}</span>}
                    </React.Fragment>
                ) : (
                    <span className={styles.text}>{children}</span>
                )}
            </Component>
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
