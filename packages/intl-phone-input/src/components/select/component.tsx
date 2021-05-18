/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useCallback, useMemo } from 'react';

import { OptionsList, Select, SelectProps } from '@alfalab/core-components-select';
import { Country } from '@alfalab/utils';

import { SelectField } from '../select-field';
import { FlagIcon } from '../flag-icon';

import styles from './index.module.css';

type CountriesSelectProps = Pick<SelectProps, 'size' | 'disabled' | 'onChange' | 'preventFlip'> & {
    selected: string;
    countries: Country[];
    fieldWidth: number | null;
};

export const CountriesSelect: FC<CountriesSelectProps> = ({
    disabled,
    size,
    selected,
    countries,
    fieldWidth,
    preventFlip,
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
        [countries],
    );

    const renderOptionsList = useCallback(
        props => (
            <div style={{ width: fieldWidth || 0 }}>
                <OptionsList {...props} />
            </div>
        ),
        [fieldWidth],
    );

    return (
        <div className={styles.component} onClick={event => event.stopPropagation()}>
            <Select
                disabled={disabled}
                size={size}
                options={options}
                selected={selected}
                onChange={onChange}
                Field={SelectField}
                OptionsList={renderOptionsList}
                preventFlip={preventFlip}
            />
        </div>
    );
};
