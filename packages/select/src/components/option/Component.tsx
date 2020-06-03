import React, { ReactNode } from 'react';
import cn from 'classnames';
import { BaseOptionProps, OptionShape } from '../../typings';

import styles from './index.module.css';

export type OptionProps = BaseOptionProps & {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Кастомный рендер пункта меню
     */
    optionRenderer?: (option: OptionShape) => ReactNode;
};

export const Option = ({
    size = 's',
    option,
    selected,
    highlighted,
    disabled,
    optionRenderer,
    ...rest
}: OptionProps) => (
    <div
        {...rest}
        className={cn(styles.option, styles[size], {
            [styles.highlighted]: highlighted,
            [styles.selected]: selected,
            [styles.disabled]: disabled,
        })}
    >
        {optionRenderer ? optionRenderer(option) : option.text}
    </div>
);
