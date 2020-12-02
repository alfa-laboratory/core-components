import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { Select, SelectProps } from '@alfalab/core-components-select';
import { Country } from '@alfalab/utils';

import { SelectField } from '../select-field';
import { FlagIcon } from '../flag-icon';

import styles from './index.module.css';

type CountriesSelectProps = {
    disabled: boolean;
    size: SelectProps['size'];
    selected: string;
    countries: Country[];
    onChange: SelectProps['onChange'];
};

export const CountriesSelect: FC<CountriesSelectProps> = ({
    disabled,
    size,
    selected,
    countries,
    onChange,
}) => {
    const options = useMemo(
        () =>
            countries.map(({ iso2, dialCode, name }) => ({
                key: iso2,
                value: iso2,
                content: (
                    <span className={cn(styles.option)}>
                        <FlagIcon country={iso2} className={cn(styles.flag)} />

                        <span className={cn(styles.optionTextWrap)}>
                            <span className={cn(styles.countryName)}>{name}</span>
                            <span className={cn(styles.dialCode)}>+{dialCode}</span>
                        </span>
                    </span>
                ),
            })),
        [countries],
    );

    return (
        <Select
            disabled={disabled}
            size={size}
            options={options}
            selected={selected}
            onChange={onChange}
            Field={SelectField}
            className={cn(styles.component)}
        />
    );
};
