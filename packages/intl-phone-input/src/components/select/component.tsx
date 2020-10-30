import React, { FC, useMemo } from 'react';
import { Select, SelectProps } from '@alfalab/core-components-select';

import { SelectField } from '../select-field';
import { FlagIcon } from '../flag-icon';
import { countries } from '../../countries';

import styles from './index.module.css';

type CountriesSelectProps = {
    disabled: boolean;
    size: SelectProps['size'];
    selected: string;
    onChange: SelectProps['onChange'];
};

export const CountriesSelect: FC<CountriesSelectProps> = ({
    disabled,
    size,
    selected,
    onChange,
}) => {
    const options = useMemo(
        () =>
            countries.map(({ iso2, dialCode, name }) => ({
                key: iso2,
                value: iso2,
                content: (
                    <span className={styles.option}>
                        <FlagIcon country={iso2} className={styles.flag} />

                        <span className={styles.optionTextWrap}>
                            <span className={styles.countryName}>{name}</span>
                            <span className={styles.dialCode}>+{dialCode}</span>
                        </span>
                    </span>
                ),
            })),
        [],
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
