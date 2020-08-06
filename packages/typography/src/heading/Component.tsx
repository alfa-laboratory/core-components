import cn from 'classnames';
import React from 'react';

import styles from './index.module.css';

const View = {
    'headline-xlarge': styles.headlineXlarge,
    'headline-large': styles.headlineLarge,
    'headline-normal': styles.headlineNormal,
    'headline-small': styles.headlineSmall,
    'headline-xsmall': styles.headlineXsmall,
    'promo-xlarge': styles.promoXlarge,
    'promo-large': styles.promoLarge,
    'promo-normal': styles.promoNormal,
    'promo-small': styles.promoSmall,
    'promo-xsmall': styles.promoXsmall,
};

type ViewType = keyof typeof View;

export type HeadingProps = {
    /**
     * Уровень заголовка
     */
    level?: 1 | 2 | 3 | 4 | 5;

    /**
     * Вариант начертания
     */
    view?: ViewType;

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
    level = 2,
    view = 'headline-large',
    className,
    dataTestId,
    children,
}: HeadingProps): React.ReactElement => {
    const Component = `h${level}`;

    return React.createElement(
        Component,
        {
            className: cn(styles.component, className, View[view]),
            'data-test-id': dataTestId,
        },
        children,
    );
};
