/**
 * Vendor
 */

import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './index.module.css';

/**
 * Types
 */

export type PureInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    /** Растягивает компонент на ширину контейнера */
    block?: boolean;

    /** Атрибут type */
    htmlType?: 'number' | 'card' | 'email' | 'hidden' | 'money' | 'password' | 'tel' | 'text';

    /** Размер компонента */
    size?: 's' | 'm' | 'l';

    /** Дополнительный класс */
    className?: string;

    /** Идентификатор для систем автоматизированного тестирования */
    dataTestId?: string;
};

/**
 * Expo
 */

export const PureInput = React.forwardRef<HTMLInputElement, PureInputProps>(
    (
        { size = 's', htmlType = 'text', block = false, className, dataTestId, ...restProps },
        ref,
    ) => (
        <input
            {...restProps}
            className={cn(
                styles.component,
                styles[size],
                {
                    [styles.block]: block,
                },
                className,
            )}
            ref={ref}
            type={htmlType}
            data-test-id={dataTestId}
        />
    ),
);
