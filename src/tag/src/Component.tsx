import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Component.module.css';

export type TagProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Текст всплывающей подсказки */
    title?: string;

    /** Управление возможностью взаимодействия с компонентом */
    disabled?: boolean;

    /** Обработчик нажатия на кнопку */
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;

    /** Отображение кнопки в отмеченном (зажатом) состоянии */
    checked?: boolean;

    /** Размер компонента */
    size?: 'xs' | 's' | 'm' | 'l';

    /** Слот слева */
    leftAddons?: React.ReactNode;

    /** Слот справа */
    rightAddons?: React.ReactNode;

    /** Дополнительный класс */
    className?: string;

    /** Идентификатор для систем автоматизированного тестирования */
    dataTestId?: string;

    /** Дочерние элементы */
    children?: React.ReactNode;
};

export const Tag = ({
    rightAddons,
    leftAddons,
    children,
    size = 's',
    title,
    disabled,
    onClick,
    checked,
    className,
    dataTestId,
    ...rest
}: TagProps) => {
    const tagProps = {
        className: cn(styles.component, styles[size], { [styles.checked]: checked }, className),
        title,
        disabled,
        onClick,
        'data-test-id': dataTestId,
    };

    return (
        <button type='button' {...tagProps} {...rest}>
            {leftAddons ? <span className={cn(styles.addons)}>{leftAddons}</span> : null}
            <span>{children}</span>
            {rightAddons ? <span className={cn(styles.addons)}>{rightAddons}</span> : null}
        </button>
    );
};
