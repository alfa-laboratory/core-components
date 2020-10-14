import React, { FC } from 'react';
import { FieldProps } from '@alfalab/core-components-select';

import styles from './index.module.css';

export const Field: FC<FieldProps> = ({
    valueRenderer,
    selectedItems = [],
    Arrow,
    innerProps = {},
    ...restProps
}) => {
    return (
        <div className={styles.component} {...innerProps} {...restProps}>
            {valueRenderer ? valueRenderer(selectedItems) : null}
            {Arrow}
        </div>
    );
};
