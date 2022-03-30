import React, { HTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

import { Color } from '../colors';

import styles from './index.module.css';
import colors from '../colors.module.css';

type NativeProps = HTMLAttributes<HTMLSpanElement>;

export type TextProps = Omit<NativeProps, 'color'> & {
    /**
     * [Вариант начертания](https://alfa-laboratory.github.io/core-components/master/?path=/docs/гайдлайны-типографика--page)
     */
    view?:
        | 'primary-large'
        | 'primary-medium'
        | 'primary-small'
        | 'secondary-large'
        | 'secondary-medium'
        | 'secondary-small'
        | 'component'
        | 'caps';

    /**
     * Цвет текста
     */
    color?: Color;

    /**
     * Толщина шрифта
     */
    weight?: 'regular' | 'medium' | 'bold';

    /**
     * Делает цифры моноширинными
     */
    monospaceNumbers?: boolean;

    /**
     * HTML тег
     */
    tag?: 'p' | 'span' | 'div';

    /**
     * Css-класс для стилизации (native prop)
     */
    className?: string;

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;

    /**
     * Контент (native prop)
     */
    children?: React.ReactNode;
};

type TextElementType = HTMLParagraphElement | HTMLSpanElement | HTMLDivElement;

export const Text = forwardRef<TextElementType, TextProps>(
    (
        {
            view = 'primary-medium',
            tag: Component = 'span',
            weight = 'regular',
            monospaceNumbers = false,
            color,
            className,
            dataTestId,
            children,
            ...restProps
        },
        ref,
    ) => (
        <Component
            className={cn(
                { [styles.paragraph]: Component === 'p', [styles.monospace]: monospaceNumbers },
                className,
                color && colors[color],
                styles[view],
                styles[weight],
            )}
            data-test-id={dataTestId}
            ref={ref as never}
            {...restProps}
        >
            {children}
        </Component>
    ),
);
