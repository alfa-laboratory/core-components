import React, { FC, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { FieldProps } from '@alfalab/core-components-select';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

export const Field: FC<FieldProps> = ({
    valueRenderer,
    selectedItems = [],
    Arrow,
    innerProps = {},
    ...restProps
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');

    const ref = innerProps.ref ? mergeRefs([innerProps.ref, wrapperRef]) : wrapperRef;

    return (
        <div
            ref={ref}
            className={cn(styles.component, {
                [styles.focusVisible]: focusVisible,
            })}
        >
            <div {...innerProps} {...restProps} className={styles.inner}>
                {valueRenderer ? valueRenderer(selectedItems) : null}
                {Arrow}
            </div>
        </div>
    );
};
