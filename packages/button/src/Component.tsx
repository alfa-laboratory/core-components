import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';

import { useFocus } from '@alfalab/hooks';
import { Loader } from '@alfalab/core-components-loader';

import styles from './index.module.css';

export type ComponentProps = {
    /**
     * Тип кнопки
     */
    view?: 'primary' | 'secondary' | 'outlined' | 'link' | 'ghost';

    /**
     * Слот слева
     */
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

    /**
     * Размер компонента
     */
    size?: 'xs' | 's' | 'm' | 'l';

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Выводит ссылку в виде кнопки
     */
    href?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Показать лоадер
     */
    loading?: boolean;
};

type AnchorButtonProps = ComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonProps = Partial<AnchorButtonProps | NativeButtonProps>;

export const Button = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            view = 'secondary',
            leftAddons,
            rightAddons,
            size = 'm',
            block = false,
            className,
            dataTestId,
            href,
            loading = false,
            ...restProps
        },
        ref,
    ) => {
        const buttonRef = useRef<HTMLElement>(null);

        const [focused] = useFocus('keyboard', buttonRef);

        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                styles[size],
                {
                    [styles.focused]: focused,
                    [styles.block]: block,
                    [styles.iconOnly]: !children,
                    [styles.loading]: loading && !href,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
        };

        const buttonChildren = (
            <React.Fragment>
                {leftAddons && <span className={cn(styles.addons)}>{leftAddons}</span>}
                {children && <span className={cn(styles.text)}>{children}</span>}
                {loading && !href && <Loader className={cn(styles.loader)} />}
                {rightAddons && <span className={cn(styles.addons)}>{rightAddons}</span>}
            </React.Fragment>
        );

        if (href) {
            return (
                <a
                    {...componentProps}
                    {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
                    href={href}
                    ref={mergeRefs([buttonRef, ref])}
                >
                    {buttonChildren}
                </a>
            );
        }

        const { disabled, ...restButtonProps } = restProps as ButtonHTMLAttributes<
            HTMLButtonElement
        >;

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                {...componentProps}
                {...restButtonProps}
                disabled={disabled || loading}
                ref={mergeRefs([buttonRef, ref])}
            >
                {buttonChildren}
            </button>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Button.defaultProps = {
    view: 'secondary',
    size: 'm',
    block: false,
    loading: false,
};
