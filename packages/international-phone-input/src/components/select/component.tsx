import React, { FC, SVGProps } from 'react';
import { InputProps } from '@alfalab/core-components-input';
import { Select, SelectProps, OptionShape } from '@alfalab/core-components-select';
import * as icons from '@alfalab/icons-flag';

import { CountriesMap } from '../../countries';
import { Field } from '../select-field';

import styles from './index.module.css';

type Props = {
    disabled: boolean;
    size: InputProps['size'];
    countriesMap: CountriesMap;
    selected: string;
    onChange: SelectProps['onChange'];
};

type IconProps = SVGProps<SVGSVGElement>;

type CountryFlags = {
    [iso2: string]: (props: IconProps) => JSX.Element;
};

// TODO: dynamic import
const countriesFlags: CountryFlags = {
    ru: props => <icons.RussiaMColorIcon {...props} />,
    az: props => <icons.AzerbaijanMColorIcon {...props} />,
};

const Option: FC<OptionShape> = ({ value }) => {
    const IconFlag = countriesFlags[value];

    return (
        <span key={value}>
            <IconFlag />
        </span>
    );
};

export const CountrySelect: FC<Props> = ({ disabled, size, countriesMap, selected, onChange }) => {
    const valueRenderer = (options: OptionShape[]) => options.map(Option);

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
            fieldProps={{ valueRenderer }}
            Field={Field}
            className={styles.component}
        />
    );
};
