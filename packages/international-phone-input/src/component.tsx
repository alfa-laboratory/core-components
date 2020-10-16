import React, { forwardRef, useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { Input, InputProps } from '@alfalab/core-components-input';
import { SelectProps } from '@alfalab/core-components-select';
import { AsYouType, CountryCode } from 'libphonenumber-js';

import { CountriesSelect } from './components';
import { getCountries, getCountriesMap } from './countries';

const countries = getCountries();
const countriesMap = getCountriesMap();

export type InternationalPhoneInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    /**
     * Значение
     */
    value: string;

    /**
     * Обработчик события изменения значения
     */
    onChange: (value: string) => void;
};

const DEFAULT_COUNTRY_ISO_2 = 'ru';
const DEFAULT_VALUE = '+7';

const MAX_DIAL_CODE_LENGTH = 4;

export const InternationalPhoneInput = forwardRef<HTMLInputElement, InternationalPhoneInputProps>(
    (props, ref) => {
        const { disabled = false, size = 'm', className, value = DEFAULT_VALUE, onChange } = props;

        const [countryIso2, setCountryIso2] = useState(DEFAULT_COUNTRY_ISO_2);

        const inputRef = useRef<HTMLInputElement>(null);

        const phoneLibUtils = useRef<typeof AsYouType>();

        const setValue = useCallback(
            inputValue => {
                let newValue = inputValue;

                if (phoneLibUtils.current) {
                    const Utils = phoneLibUtils.current;
                    const utils = new Utils(countryIso2.toUpperCase() as CountryCode);

                    newValue = utils.input(inputValue);
                }

                onChange(newValue);
            },
            [onChange, countryIso2],
        );

        const setCountryByIso2 = useCallback(
            (iso2: string) => {
                const country = countriesMap[iso2];

                const inputValue = `+${country.dialCode}`;

                onChange(inputValue);
                setCountryIso2(country.iso2);

                return country;
            },
            [onChange],
        );

        const setCountryByDialCode = useCallback(
            inputValue => {
                for (let i = 0; i < countries.length; i++) {
                    const country = countries[i];

                    if (new RegExp(`^\\+${country.dialCode}`).test(inputValue)) {
                        // Handle countries with priority field
                        if (country.priority === undefined) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            break;
                        }

                        if (countryIso2 === country.iso2) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            break;
                            // If not equal — set highest by priority
                        } else if (country.priority === 0) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            break;
                        }
                    }
                }
            },
            [countryIso2, setValue],
        );

        const loadPhoneUtils = useCallback(() => {
            return import(
                /* webpackChunkName: "libphonenumber" */ 'libphonenumber-js/bundle/libphonenumber-js.min'
            )
                .then(utils => {
                    phoneLibUtils.current = utils.AsYouType;
                })
                .catch(error => `An error occurred while loading libphonenumber-js:\n${error}`);
        }, []);

        useEffect(() => {
            setCountryByIso2(DEFAULT_COUNTRY_ISO_2);
        }, [setCountryByIso2]);

        useEffect(() => {
            if (!phoneLibUtils.current) {
                loadPhoneUtils().then(() => {
                    setValue(value);
                });
            }
        }, [loadPhoneUtils, setValue, value]);

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const {
                    target: { value: targetValue },
                } = event;

                const newValue =
                    targetValue.length === 1 && targetValue !== '+'
                        ? `+${targetValue}`
                        : targetValue;

                setValue(newValue);

                if (value.length < MAX_DIAL_CODE_LENGTH) {
                    setCountryByDialCode(newValue);
                }
            },
            [setValue, value.length, setCountryByDialCode],
        );

        const handleSelectChange = useCallback<Required<SelectProps>['onChange']>(
            payload => {
                const selected = payload.selected && payload.selected[0];

                if (selected) {
                    const country = setCountryByIso2(selected as string);
                    const inputValue = `+${country.dialCode}`;

                    if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
                    }
                }
            },
            [setCountryByIso2],
        );

        return (
            <Input
                {...props}
                onChange={handleInputChange}
                value={value}
                type='tel'
                ref={mergeRefs([inputRef, ref])}
                className={className}
                size={size}
                leftAddons={
                    <CountriesSelect
                        disabled={disabled}
                        size={size}
                        selected={countryIso2}
                        onChange={handleSelectChange}
                    />
                }
            />
        );
    },
);

InternationalPhoneInput.defaultProps = {
    size: 'm',
    value: DEFAULT_VALUE,
};
