import React, { forwardRef, useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import cn from 'classnames';

import { AsYouType, CountryCode } from 'libphonenumber-js';

import { OptionShape, SelectProps } from '@alfalab/core-components-select';
import { Country, getCountries, getCountriesHash } from '@alfalab/utils';
import {
    InputAutocomplete,
    InputAutocompleteProps,
} from '@alfalab/core-components-input-autocomplete';
import { CountriesSelect } from './components';
import styles from './index.module.css';

const countriesHash = getCountriesHash();

const MAX_DIAL_CODE_LENGTH = 4;

export type IntlPhoneInputProps = Partial<InputAutocompleteProps> &
    Pick<SelectProps, 'preventFlip'> & {
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

        /**
         * Обработчик события изменения страны
         */
        onCountryChange?: (countryCode: CountryCode) => void;

        /**
         * Список стран
         */
        countries?: Country[];

        /**
         * Возможность стереть код страны
         */
        clearableCountryCode?: boolean;
    };

export const IntlPhoneInput = forwardRef<HTMLInputElement, IntlPhoneInputProps>(
    (
        {
            disabled = false,
            readOnly = false,
            size = 'm',
            options = [],
            countries = getCountries(),
            clearableCountryCode = true,
            className,
            value,
            onChange,
            onCountryChange,
            defaultCountryIso2 = 'ru',
            preventFlip,
            inputProps,
            ...restProps
        },
        ref,
    ) => {
        const [countryIso2, setCountryIso2] = useState(defaultCountryIso2.toLowerCase());

        const inputRef = useRef<HTMLInputElement>(null);
        const [inputWrapperRef, setInputWrapperRef] = useState<HTMLDivElement | null>(null);

        const phoneLibUtils = useRef<typeof AsYouType>();

        const setCountryByIso2 = useCallback(
            (iso2: string) => {
                const country = countriesHash[iso2];

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

                    newValue = utils.input(inputValue);
                }
                onChange(newValue);
            },
            [countryIso2, onChange],
        );

        const handleCountryChange = useCallback(
            (countryCode: string) => {
                if (onCountryChange) {
                    onCountryChange(countryCode.toUpperCase() as CountryCode);
                }
            },
            [onCountryChange],
        );

        const setCountryByDialCode = useCallback(
            inputValue => {
                for (let i = 0; i < countries.length; i++) {
                    const country = countries[i];

                    if (new RegExp(`^\\+${country.dialCode}`).test(inputValue)) {
                        // Сначала проверяем, если приоритет не указан
                        if (country.priority === undefined) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            handleCountryChange(country.iso2);

                            break;
                        }

                        // Если страна уже была выставлена через селект, и коды совпадают
                        if (countryIso2 === country.iso2) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            handleCountryChange(country.iso2);

                            break;
                            // Если не совпадают - выбираем по приоритету
                        } else if (country.priority === 0) {
                            setValue(inputValue);
                            setCountryIso2(country.iso2);
                            handleCountryChange(country.iso2);

                            break;
                        }
                    }
                }
            },
            [countries, countryIso2, setValue, handleCountryChange],
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
                const country = countriesHash[countryIso2];

                if (clearableCountryCode) {
                    const newValue =
                        targetValue.length === 1 && targetValue !== '+'
                            ? `+${targetValue}`
                            : targetValue;

                    setValue(newValue);

                    if (value.length < MAX_DIAL_CODE_LENGTH) {
                        setCountryByDialCode(newValue);
                    }
                    return;
                }

                if (!clearableCountryCode) {
                    let newValue;

                    if (targetValue[0] === '8') {
                        newValue = `+${country.dialCode}${targetValue.substr(1)}`;
                        setValue(newValue);
                        return;
                    }

                    if (targetValue.substr(1) < country.dialCode) {
                        newValue = `+${country.dialCode}`;
                        setValue(newValue);
                        return;
                    }
                    setValue(targetValue);
                }
            },
            [clearableCountryCode, countryIso2, setCountryByDialCode, setValue, value.length],
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

                    handleCountryChange(country.iso2);
                }
            },
            [setCountryByIso2, handleCountryChange],
        );

        const handleChange = useCallback(
            (payload: {
                selected: OptionShape | null;
                selectedMultiple: OptionShape[];
                name?: string;
            }) => {
                const { selected } = payload;
                if (!selected) return;
                if (selected.key.length < MAX_DIAL_CODE_LENGTH) {
                    setCountryByDialCode(selected.key);
                }
                setValue(selected.key);
            },
            [setValue, setCountryByDialCode],
        );

        useEffect(() => {
            if (!phoneLibUtils.current) {
                loadPhoneUtils().then(() => {
                    setCountryByDialCode(value);
                });
            }
        }, [countryIso2, loadPhoneUtils, setCountryByDialCode, value]);

        return (
            <InputAutocomplete
                {...restProps}
                ref={ref}
                inputProps={{
                    ...inputProps,
                    ref: inputRef,
                    wrapperRef: setInputWrapperRef,
                    type: 'tel',
                    className: cn(className, styles[size]),
                    addonsClassName: styles.addons,
                    leftAddons: (
                        <CountriesSelect
                            disabled={disabled || readOnly}
                            size={size}
                            selected={countryIso2}
                            countries={countries}
                            onChange={handleSelectChange}
                            fieldWidth={
                                inputWrapperRef && inputWrapperRef.getBoundingClientRect().width
                            }
                            preventFlip={preventFlip}
                        />
                    ),
                }}
                closeOnSelect={true}
                onInput={handleInputChange}
                onChange={handleChange}
                options={options}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                className={className}
                value={value}
            />
        );
    },
);

IntlPhoneInput.defaultProps = {
    size: 'm',
    defaultCountryIso2: 'ru',
};
