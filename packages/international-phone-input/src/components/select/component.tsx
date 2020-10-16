import React, { FC } from 'react';
import { Select, SelectProps } from '@alfalab/core-components-select';
import { countriesFlags, SelectField } from '../index';
import { getCountriesMap } from '../../countries';

import styles from './index.module.css';

const countriesMap = getCountriesMap();

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
            options={[
                {
                    value: 'ru',
                    text: '',
                    content: (
                        <div>
                            <span>{countriesMap.ru.name}</span>
                            <span>+7</span>
                            <countriesFlags.ru />
                        </div>
                    ),
                },
                {
                    value: 'az',
                    text: '',
                    content: (
                        <div>
                            <span>{countriesMap.az.name}</span>
                            <span>+994</span>
                            <countriesFlags.az />
                        </div>
                    ),
                },
            ]}
            selected={[selected]}
            onChange={onChange}
            Field={SelectField}
            className={styles.component}
        />
    );
};
