import React from 'react';
import cn from 'classnames';

import { SelectProps } from '@alfalab/core-components-select';
import { Button, ButtonProps } from '@alfalab/core-components-button';

import styles from './index.module.css';

export const CustomSelectField: SelectProps['Field'] = ({ selected, innerProps, Arrow, open }) => (
    <Button
        {...(innerProps as ButtonProps)}
        size='xxs'
        view='link'
        className={cn(styles.field, { [styles.open]: open })}
        rightAddons={Arrow}
    >
        {selected?.content}
    </Button>
);
