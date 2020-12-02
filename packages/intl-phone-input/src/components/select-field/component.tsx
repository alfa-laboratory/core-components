import React, { useRef, FC } from 'react';
import mergeRefs from 'react-merge-refs';
import cn from 'classnames';
import { FieldProps } from '@alfalab/core-components-select';
import { useFocus } from '@alfalab/hooks';

import { FlagIcon } from '../flag-icon';

import styles from './index.module.css';

export const SelectField: FC<FieldProps> = ({ selected, Arrow, size, innerProps = {} }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');

    const ref = innerProps.ref ? mergeRefs([innerProps.ref, wrapperRef]) : wrapperRef;

    return (
        <div
            ref={ref}
            className={cn(styles.component, size && styles[size], {
                [styles.focusVisible]: focusVisible,
            })}
        >
            <div {...innerProps} className={cn(styles.inner)}>
                {selected && (
                    <span>
                        <FlagIcon country={selected.value} size={size} />
                    </span>
                )}
                {Arrow}
            </div>
        </div>
    );
};
