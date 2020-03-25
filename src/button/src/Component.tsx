/**
 * Vendor
 */

import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

type ComponentProps = {
    /** Тип кнопки */
    type?: 'primary' | 'secondary' | 'outlined' | 'link' | 'ghost';

    /** Атрибут type */
    htmlType?: 'button' | 'reset' | 'submit';

    /** Слот слева */
    leftAddons?: React.ReactNode;

    /** Слот справа */
    rightAddons?: React.ReactNode;

    /** Размер компонента */
    size?: 'xs' | 's' | 'm' | 'l';

    /** Растягивает компонент на ширину контейнера */
    block?: boolean;

    /** Дополнительный класс */
    className?: string;

    /** Идентификатор для систем автоматизированного тестирования */
    dataTestId?: string;
};

type AnchorButtonProps = ComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ComponentProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;
type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

/**
 * Expo
 */

export const Button = React.forwardRef<HTMLAnchorElement & HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            type = 'secondary',
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
                styles[type],
                styles[size],
                {
                    [styles.block]: block,
                    [styles.iconOnly]: !children,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
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
                <a {...componentProps} {...restProps} ref={ref}>
                    {buttonChildren}
                </a>
            );
        }

        const { htmlType, ...buttonProps } = restProps;

        return (
            // eslint-disable-next-line react/button-has-type
            <button {...componentProps} {...buttonProps} type={htmlType} ref={ref}>
                {buttonChildren}
            </button>
        );
    },
);
