import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

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
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
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
            ...restProps
        },
        ref,
    ) => {
        const componentProps = {
            className: cn(
                styles.component,
                {
                    [styles.block]: block,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
        };

        const wrapperProps = {
            className: cn(styles.wrapper, styles[view], styles[size], {
                [styles.iconOnly]: !children,
            }),
        };

        const buttonChildren = (
            // https://www.kizu.ru/keyboard-only-focus/
            <span {...wrapperProps} tabIndex={-1}>
                {leftAddons && <span className={cn(styles.addons)}>{leftAddons}</span>}
                {children && <span className={cn(styles.text)}>{children}</span>}
                {rightAddons && <span className={cn(styles.addons)}>{rightAddons}</span>}
            </span>
        );

        if (href) {
            return (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                <a {...componentProps} {...restProps} ref={ref} tabIndex={0}>
                    {buttonChildren}
                </a>
            );
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button {...componentProps} {...restProps} ref={ref} tabIndex={0}>
                {buttonChildren}
            </button>
        );
    },
);
