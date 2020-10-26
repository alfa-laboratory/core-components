import React, { FC } from 'react';
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
    return (
        <Select
            disabled={disabled}
            size={size}
            options={countries.map(({ iso2, dialCode, name }) => {
                return {
                    value: iso2,
                    text: '',
                    content: (
                        <div>
                            <span>{name}</span>
                            <span>{dialCode}</span>
                            <FlagIcon country={iso2} size={size} />
                        </div>
                    ),
                };
            })}
            selected={[selected]}
            onChange={onChange}
            Field={SelectField}
            className={styles.component}
        />
    );
};
