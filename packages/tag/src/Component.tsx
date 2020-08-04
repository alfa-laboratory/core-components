import React, { ButtonHTMLAttributes, forwardRef, useRef, useImperativeHandle } from 'react';
import cn from 'classnames';

import { useKeyboardFocusable } from '@alfalab/core-components-keyboard-focusable';

import styles from './index.module.css';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type TagProps = Omit<NativeProps, 'onClick'> & {
    /**
     * Отображение кнопки в отмеченном (зажатом) состоянии
     */
    checked?: boolean;

    /**
     * Размер компонента
     */
    size?: 'xs' | 's' | 'm' | 'l';

    /**
     * Слот слева
     */
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Обработчик нажатия
     */
    onClick?: (
        event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;
};

export const Tag = forwardRef<HTMLButtonElement, TagProps>(
    (
        {
            rightAddons,
            leftAddons,
            children,
            size = 's',
            checked,
            className,
            dataTestId,
            name,
            onClick,
            ...restProps
        },
        ref,
    ) => {
        const tagRef = useRef<HTMLButtonElement>(null);
        const keyboardFocus = useKeyboardFocusable(tagRef);

        useImperativeHandle(ref, () => tagRef.current as HTMLButtonElement);

        const tagProps = {
            className: cn(
                styles.component,
                styles[size],
                { [styles.checked]: checked, [styles.focused]: keyboardFocus.focused },
                className,
            ),
            'data-test-id': dataTestId,
        };

        const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (onClick) {
                onClick(event, { name, checked: !checked });
            }
        };

        return (
            <button ref={tagRef} type='button' onClick={handleClick} {...tagProps} {...restProps}>
                {leftAddons ? <span className={cn(styles.addons)}>{leftAddons}</span> : null}
                <span>{children}</span>
                {rightAddons ? <span className={cn(styles.addons)}>{rightAddons}</span> : null}
            </button>
        );
    },
);
