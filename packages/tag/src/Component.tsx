import React, { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

const colorStylesMap = {
    default: defaultColors,
    inverted: invertedColors,
};

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type TagProps = Omit<NativeProps, 'onClick'> & {
    /**
     * Отображение кнопки в отмеченном (зажатом) состоянии
     */
    checked?: boolean;

    /**
     * Размер компонента
     */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

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

    /**
     * Набор цветов для компонента
     */
    colors?: 'default' | 'inverted';

    /**
     * Вариант тега
     */
    variant?: 'default' | 'alt';
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
            colors = 'default',
            onClick,
            variant = 'default',
            ...restProps
        },
        ref,
    ) => {
        const colorStyles = colorStylesMap[colors];

        const tagRef = useRef<HTMLButtonElement>(null);

        const [focused] = useFocus(tagRef, 'keyboard');

        const tagProps = {
            className: cn(
                styles.component,
                colorStyles.component,
                styles[size],
                styles[variant],
                {
                    [styles.checked]: checked,
                    [colorStyles.checked]: checked,
                    [styles.focused]: focused,
                    [styles.withRightAddons]: Boolean(rightAddons),
                    [styles.withLeftAddons]: Boolean(leftAddons),
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

                {children && <span>{children}</span>}

                {rightAddons ? <span className={styles.addons}>{rightAddons}</span> : null}
            </button>
        );
    },
);
