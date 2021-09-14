import React, { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';

import { Color } from '../colors';

import colors from '../colors.module.css';

type NativeProps = HTMLAttributes<HTMLHeadingElement>;

export type TitleProps = Omit<NativeProps, 'color'> & {
    /**
     * HTML тег
     */
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';

    /**
     * [Вариант начертания](https://alfa-laboratory.github.io/core-components/master/?path=/docs/гайдлайны-типографика--page)
     */
    view?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';

    /**
     * Цвет текста
     */
    color?: Color;

    /**
     * Толщина шрифта
     */
    weight?: 'regular' | 'medium' | 'bold';

    /**
     * Шрифт текста
     */
    font?: 'styrene' | 'system';

    /**
     * Добавляет отступы
     */
    defaultMargins?: boolean;

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

type Styles = {
    styles: {
        [key: string]: string;
    };
};

type TitleElementType = HTMLHeadingElement | HTMLDivElement;

export const Title = forwardRef<TitleElementType, TitleProps & Styles>(
    (
        {
            tag: Component = 'div',
            view = 'medium',
            font = 'styrene',
            weight = font === 'styrene' ? 'medium' : 'bold',
            defaultMargins = false,
            color,
            className,
            dataTestId,
            children,
            styles,
            ...restProps
        },
        ref,
    ) => (
        <Component
            className={cn(
                styles.component,
                className,
                styles[`${font}-${view}`],
                defaultMargins && styles[`margins-${view}`],
                styles[weight],
                color && colors[color],
            )}
            data-test-id={dataTestId}
            ref={ref}
            {...restProps}
        >
            {children}
        </Component>
    ),
);
