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
    view = 'primary-medium',
    tag: Component = 'span',
    weight = 'regular',
    color,
    className,
    dataTestId,
    children,
}: TextProps): React.ReactElement => (
    <Component
        className={cn(
            { [styles.paragraph]: Component === 'p' },
            className,
            color && colors[color],
            styles[view],
            styles[weight],
        )}
        data-test-id={dataTestId}
    >
        {children}
    </Component>
);
