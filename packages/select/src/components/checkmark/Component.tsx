import React, { useCallback } from 'react';
import cn from 'classnames';
import { Checkbox, CheckboxProps } from '@alfalab/core-components-checkbox';
import { CheckmarkProps } from '../../typings';

import styles from './index.module.css';

export const Checkmark = ({
    selected,
    className,
    multiple,
    position = 'before',
}: CheckmarkProps) => {
    const single = !multiple || position === 'after';

    const checkmarkClassNames = cn(styles.checkmark, className, styles[position], {
        [styles.multiple]: !single,
        [styles.single]: single,
        [styles.selected]: selected,
    });

    const handleCheckboxClick = useCallback<Required<CheckboxProps>['onClick']>(
        event => event.stopPropagation(),
        [],
    );

    return single ? (
        <span className={checkmarkClassNames} />
    ) : (
        <Checkbox
            checked={selected}
            className={checkmarkClassNames}
            size="m"
            onClick={handleCheckboxClick}
        />
    );
};
