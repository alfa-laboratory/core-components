import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Component.module.css';

export type TagProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Отображение кнопки в отмеченном (зажатом) состоянии */
    checked?: boolean;

    /** Размер компонента */
    size?: 'xs' | 's' | 'm' | 'l';

    /** Слот слева */
    leftAddons?: React.ReactNode;

    /** Слот справа */
    rightAddons?: React.ReactNode;

    /** Идентификатор для систем автоматизированного тестирования */
    dataTestId?: string;
};

export const Tag = ({
    rightAddons,
    leftAddons,
    children,
    size = 's',
    checked,
    className,
    dataTestId,
    ...restProps
}: TagProps) => {
    const tagProps = {
        className: cn(styles.component, styles[size], { [styles.checked]: checked }, className),
        'data-test-id': dataTestId,
    };

    return (
        <button type='button' {...tagProps} {...restProps}>
            {leftAddons ? <span className={cn(styles.addons)}>{leftAddons}</span> : null}
            <span>{children}</span>
            {rightAddons ? <span className={cn(styles.addons)}>{rightAddons}</span> : null}
        </button>
    );
};
