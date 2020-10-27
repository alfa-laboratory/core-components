import React, { FC, useMemo } from 'react';
import { Select, SelectProps } from '@alfalab/core-components-select';

import { SelectField } from '../select-field';
import { FlagIcon } from '../flag-icon';
import { countries } from '../../countries';

import styles from './index.module.css';

type Props = {
    disabled: boolean;
    size: SelectProps['size'];
    selected: string;
    onChange: SelectProps['onChange'];
};

export const CountriesSelect: FC<Props> = ({ disabled, size, selected, onChange }) => {
    const options = useMemo(
        () =>
            countries.map(({ iso2, dialCode, name }) => ({
                key: iso2,
                value: iso2,
                content: (
                    <div>
                        <span>{name}</span>
                        <span>{dialCode}</span>
                        <FlagIcon country={iso2} size={size} />
                    </div>
                ),
            })),
        [size],
    );

    return (
        <Select
            disabled={disabled}
            size={size}
            options={options}
            selected={selected}
            onChange={onChange}
            Field={SelectField}
            className={styles.component}
        />
    );
};
