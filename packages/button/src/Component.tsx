import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import { Loader } from '@alfalab/core-components-loader';

import styles from './index.module.css';

type ComponentProps = {
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
type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

export const Button = React.forwardRef<HTMLAnchorElement & HTMLButtonElement, ButtonProps>(
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
            disabled = false,
            ...restProps
        },
        ref,
    ) => {
        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                styles[size],
                {
                    [styles.block]: block,
                    [styles.iconOnly]: !children,
                    [styles.loading]: loading,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
            disabled: disabled || loading,
        };

        const buttonChildren = (
            <React.Fragment>
                {leftAddons && <span className={cn(styles.addons)}>{leftAddons}</span>}
                {children && <span className={cn(styles.text)}>{children}</span>}
                {rightAddons && <span className={cn(styles.addons)}>{rightAddons}</span>}
            </React.Fragment>
        );

        if (href) {
            return (
                <a {...componentProps} {...restProps} href={href} ref={ref}>
                    {buttonChildren}
                </a>
            );
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button {...componentProps} {...restProps} ref={ref}>
                {buttonChildren}
                {loading && <Loader className={cn(styles.loader)} />}
            </button>
        );
    },
);
