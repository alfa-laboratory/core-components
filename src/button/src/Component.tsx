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
    type?: 'primary' | 'secondary' | 'outlined' | 'link' | 'ghost';
    htmlType?: 'button' | 'reset' | 'submit';
    leftAddons?: React.ReactNode;
    rightAddons?: React.ReactNode;
    addonsClassName?: string;
    size?: 'xs' | 's' | 'm' | 'l';
    block?: boolean;
    className?: string;
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
            addonsClassName,
            size = 'm',
            block = false,
            className = '',
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
                    [styles['icon-only']]: !children,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
        };

        const buttonChildren = (
            <React.Fragment>
                {leftAddons && (
                    <span className={cn(styles.addons, addonsClassName)}>{leftAddons}</span>
                )}
                {children && <span className={cn(styles.text)}>{children}</span>}
                {rightAddons && (
                    <span className={cn(styles.addons, addonsClassName)}>{rightAddons}</span>
                )}
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
