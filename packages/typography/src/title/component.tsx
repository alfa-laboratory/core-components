import cn from 'classnames';
import React from 'react';
import { Color } from '../colors';

import colors from '../colors.module.css';

export type TitleProps = {
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
     * Css-класс для стилизации
     */
    className?: string;

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;

    /**
     * Контент
     */
    children?: React.ReactNode;
};

type Styles = {
    styles: {
        [key: string]: string;
    };
};

export const Title: React.FC<TitleProps & Styles> = ({
    tag: Component = 'div',
    view = 'medium',
    font = 'styrene',
    weight = font === 'styrene' ? 'medium' : 'bold',
    color,
    className,
    dataTestId,
    children,
    styles,
}) => (
    <Component
        className={cn(
            styles.component,
            className,
            styles[`${font}-${view}`],
            styles[weight],
            color && colors[color],
        )}
        data-test-id={dataTestId}
    >
        {children}
    </Component>
);
