import React, { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

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

        const [focused] = useFocus(tagRef, 'keyboard');

        const tagProps = {
            className: cn(
                styles.component,
                styles[size],
                {
                    [styles.checked]: checked,
                    [styles.focused]: focused,
                },
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
            <button
                ref={mergeRefs([tagRef, ref])}
                type='button'
                onClick={handleClick}
                {...tagProps}
                {...restProps}
            >
                {leftAddons ? <span className={styles.addons}>{leftAddons}</span> : null}

                <span>{children}</span>

                {rightAddons ? <span className={styles.addons}>{rightAddons}</span> : null}
            </button>
        );
    },
);
