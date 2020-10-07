import cn from 'classnames';
import React, { forwardRef, Children } from 'react';
import mergeRefs from 'react-merge-refs';

import styles from './index.module.css';

export type ListProps = {
    /**
     * HTML тег
     * @default 'ul'
     */
    tag?: 'ul' | 'ol';
    /**
     * Маркер
     * @default '—' for ul and 'decimal' for ol
     */
    marker?: 'lower-alpha' | 'decimal' | string | React.ReactNode;

    /**
     * Css-класс для стилизации
     */
    className?: string;

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;
    /** Дочерние элементы */
    children?: React.ReactNode;
};

export const List = forwardRef<HTMLOListElement | HTMLUListElement, ListProps>(
    ({ tag: Component = 'ul', marker, className, dataTestId, children, ...props }, ref) => {
        const markerType = marker || (Component === 'ul' ? '—' : 'decimal');
        const listClassNames = cn(
            styles.list,
            {
                [styles.lowerAlpha]: markerType === 'lower-alpha',
                [styles.decimal]: markerType === 'decimal',
                [styles.orderedList]: Component === 'ol',
            },
            className,
        );
        const itemClassNames = cn(styles.item, {
            [styles.unorderedItem]: Component === 'ul',
            [styles.orderedItem]: Component === 'ol',
        });

        return (
            <Component
                ref={mergeRefs([ref])}
                className={listClassNames}
                data-test-id={dataTestId}
                {...props}
            >
                {Children.map(children, child => (
                    <li className={itemClassNames}>
                        {Component !== 'ol' && <div className={styles.slot}>{markerType}</div>}
                        {child}
                    </li>
                ))}
            </Component>
        );
    },
);
