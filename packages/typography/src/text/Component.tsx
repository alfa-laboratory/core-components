import cn from 'classnames';
import React from 'react';
import { Color } from '../colors';

import styles from './index.module.css';
import colors from '../colors.module.css';

export type TextProps = {
    /**
     * Вариант начертания
     */
    view?:
        | 'primary-large'
        | 'primary-normal'
        | 'primary-small'
        | 'secondary-large'
        | 'secondary-normal'
        | 'secondary-small';

    /**
     * Цвет текста
     */
    color?: Color;

    /**
     * Толщина шрифта
     */
    weight?: 'regular' | 'medium' | 'bold';

    /**
     * HTML тег
     */
    tag?: 'p' | 'span' | 'div';

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

export const Text: React.FC<TextProps> = ({
    view = 'primary-normal',
    tag = 'span',
    weight = 'regular',
    color,
    className,
    dataTestId,
    children,
}: TextProps): React.ReactElement => {
    const Component = tag;
    const colorClass = color ? colors[color] : '';

    return React.createElement(
        Component,
        {
            className: cn(
                { [styles.component]: tag === 'p' },
                className,
                colorClass,
                styles[view],
                styles[weight],
            ),
            'data-test-id': dataTestId,
        },
        children,
    );
};
