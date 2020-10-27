import React, { forwardRef, useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import cn from 'classnames';

import mergeRefs from 'react-merge-refs';
import { Input, InputProps } from '@alfalab/core-components-input';
import { SelectProps } from '@alfalab/core-components-select';
import { AsYouType, CountryCode } from 'libphonenumber-js';

import { CountriesSelect } from './components';
import { countriesMap, countries } from './countries';

import styles from './index.module.css';

export type IntlPhoneInputProps = Omit<
    InputProps,
    'value' | 'onChange' | 'type' | 'defaultValue'
> & {
    /**
     * Значение
     */
    value: string;

    /**
     * Обработчик события изменения значения
     */
    onChange: (value: string) => void;

    /**
     * Дефолтный код страны
     */
    defaultCountryIso2?: string;
};

const MAX_DIAL_CODE_LENGTH = 4;

export const IntlPhoneInput = forwardRef<HTMLInputElement, IntlPhoneInputProps>((props, ref) => {
    const {
        disabled = false,
        size = 'm',
        className,
        value,
        onChange,
        defaultCountryIso2 = 'ru',
    } = props;

    const [countryIso2, setCountryIso2] = useState(defaultCountryIso2);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const phoneLibUtils = useRef<typeof AsYouType>();

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

    const setValue = useCallback(
        inputValue => {
            let newValue = inputValue;

            if (phoneLibUtils.current) {
                const Utils = phoneLibUtils.current;
                const utils = new Utils(countryIso2.toUpperCase() as CountryCode);

                if (utils.country && countryIso2 !== utils.country.toLowerCase()) {
                    setCountryByIso2(utils.country.toLowerCase());
                }

                newValue = utils.input(inputValue);
            }

            onChange(newValue);
        },
        [onChange, countryIso2, setCountryByIso2],
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
        // prettier-ignore
        return import(/* webpackChunkName: "libphonenumber" */ 'libphonenumber-js/bundle/libphonenumber-js.min')
                .then(utils => {
                    phoneLibUtils.current = utils.AsYouType;
                })
                .catch(error => `An error occurred while loading libphonenumber-js:\n${error}`);
    }, []);

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const {
                target: { value: targetValue },
            } = event;

            const newValue =
                targetValue.length === 1 && targetValue !== '+' ? `+${targetValue}` : targetValue;

            setValue(newValue);

            if (value.length < MAX_DIAL_CODE_LENGTH) {
                setCountryByDialCode(newValue);
            }
        },
        [setValue, value.length, setCountryByDialCode],
    );

    const handleSelectChange = useCallback<Required<SelectProps>['onChange']>(
        ({ selected }) => {
            if (selected) {
                const country = setCountryByIso2(selected.value);
                const inputValue = `+${country.dialCode}`;

                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
                }
            }
        },
        [setCountryByIso2],
    );

    useEffect(() => {
        if (!phoneLibUtils.current) {
            loadPhoneUtils().then(() => {
                setCountryByDialCode(value);
            });
        }
    }, [loadPhoneUtils, setCountryByDialCode, value]);

    return (
        <Input
            {...props}
            onChange={handleInputChange}
            value={value}
            type='tel'
            ref={mergeRefs([inputRef, ref])}
            wrapperRef={wrapperRef}
            className={cn(className, styles[size])}
            addonsClassName={styles.addons}
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
});

IntlPhoneInput.defaultProps = {
    size: 'm',
    defaultCountryIso2: 'ru',
};
