import cn from 'classnames';
import React from 'react';
import { Color } from '../colors';

import styles from './index.module.css';
import colors from '../colors.module.css';

export type HeadingProps = {
    /**
     * HTML тег
     */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div';

    /**
     * Вариант начертания
     */
    view?: 'xlarge' | 'large' | 'normal' | 'small' | 'xsmall';

    /**
     * Цвет текста
     */
    color?: Color;

    /**
     * Толщина шрифта
     */
    weight?: 'regular' | 'medium' | 'bold';

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

export const Heading: React.FC<HeadingProps> = ({
    tag = 'h2',
    view = 'large',
    weight = 'medium',
    color,
    className,
    dataTestId,
    children,
}: HeadingProps): React.ReactElement => {
    const Component = tag;
    const colorClass = color ? colors[color] : '';

    return React.createElement(
        Component,
        {
            className: cn(styles.component, className, styles[view], styles[weight], colorClass),
            'data-test-id': dataTestId,
        },
        children,
    );
};
