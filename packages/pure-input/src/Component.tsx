import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type PureInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Атрибут type
     */
    type?: 'number' | 'card' | 'email' | 'hidden' | 'money' | 'password' | 'tel' | 'text';

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const PureInput = React.forwardRef<HTMLInputElement, PureInputProps>(
    ({ size = 's', type = 'text', block = false, className, dataTestId, ...restProps }, ref) => (
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
            type={type}
            data-test-id={dataTestId}
        />
    ),
);

/**
 * Для отображения в сторибуке
 */
PureInput.defaultProps = {
    size: 's',
    type: 'text',
    block: false,
};
