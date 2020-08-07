import cn from 'classnames';
import React from 'react';

import styles from './index.module.css';

const View = {
    'headline-xlarge': styles.headlineXlarge,
    'headline-large': styles.headlineLarge,
    'headline-normal': styles.headlineNormal,
    'headline-small': styles.headlineSmall,
    'headline-xsmall': styles.headlineXsmall,
};

type ViewType = keyof typeof View;

export type HeadingClassicProps = {
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

export const HeadingClassic: React.FC<HeadingClassicProps> = ({
    level = 2,
    view = 'headline-large',
    className,
    dataTestId,
    children,
}: HeadingClassicProps): React.ReactElement => {
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
