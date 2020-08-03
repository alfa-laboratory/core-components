import cn from 'classnames';
import React from 'react';

import styles from './index.module.css';

const View = {
    'headline-styrene-xlarge': styles.headlineStyreneXlarge,
    'headline-styrene-large': styles.headlineStyreneLarge,
    'headline-styrene-normal': styles.headlineStyreneNormal,
    'headline-styrene-small': styles.headlineStyreneSmall,
    'headline-styrene-xsmall': styles.headlineStyreneXsmall,
    'headline-system-xlarge': styles.headlineSystemXlarge,
    'headline-system-large': styles.headlineSystemLarge,
    'headline-system-normal': styles.headlineSystemNormal,
    'headline-system-small': styles.headlineSystemSmall,
    'headline-system-xsmall': styles.headlineSystemXsmall,
    'promo-xlarge': styles.promoXlarge,
    'promo-large': styles.promoLarge,
    'promo-normal': styles.promoNormal,
    'promo-small': styles.promoSmall,
    'promo-xsmall': styles.promoXsmall,
};

type ViewType = keyof typeof View;

export type HeadingProps = {
    /** Уровень заголовка */
    level?: 1 | 2 | 3 | 4 | 5;
    /** Вариант начертания */
    view?: ViewType;
    /** Css-класс для стилизации */
    className?: string;
    /** Id компонента для тестов */
    dataTestId?: string;
    /** Контент */
    children?: React.ReactNode;
};

export const Heading: React.FC<HeadingProps> = ({
    level = 2,
    view = 'headline-styrene-large',
    className,
    dataTestId,
    children,
}: HeadingProps): React.ReactElement => {
    const Component = `h${level}`;

    return React.createElement(
        Component,
        {
            className: cn(styles.component, className, styles[view]),
            'data-test-id': dataTestId,
        },
        children,
    );
};
