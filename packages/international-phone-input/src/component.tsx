import React, {
    forwardRef,
    useState,
    useEffect,
    useCallback,
    ChangeEvent,
    useRef,
    useImperativeHandle,
    SVGProps,
} from 'react';
import cn from 'classnames';

// TODO: dynamic import
import { AsYouType, CountryCode } from 'libphonenumber-js';

import { InputProps, Input } from '@alfalab/core-components-input';
import { Select, FieldProps } from '@alfalab/core-components-select';

import * as icons from '@alfalab/icons-flag';

import styles from './index.module.css';

import { getCountries, getCountriesMap } from './countries';

export type InternationalPhoneInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
};

const SelectField = ({ value, rightAddons }: FieldProps) => {
    const displayValue = value && value[0] ? value[0].text : '';

    return (
        <div className={styles.selectField}>
            {displayValue}
            {rightAddons}
        </div>
    );
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

const countries = getCountries();
const countriesMap = getCountriesMap();

// TODO: сделать настраиваемым?
const DEFAULT_COUNTRY_ISO_2 = 'ru';
const DEFAULT_VALUE = '+7';

const MAX_DIAL_CODE_LENGTH = 4;

export const InternationalPhoneInput = forwardRef<HTMLInputElement, InternationalPhoneInputProps>(
    (props, ref) => {
        const { disabled, size = 'm', className, value = DEFAULT_VALUE, onChange } = props;

        const [selectOpen, setSelectOpen] = useState(false);

        const [countryIso2, setCountryIso2] = useState(DEFAULT_COUNTRY_ISO_2);

        const timerRef = useRef(0);

        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleSelectOpen = useCallback((payload?: { open?: boolean }) => {
            const { open = false } = payload || {};

            setSelectOpen(open);
        }, []);

        const setValue = useCallback(
            (iso2, inputValue) => {
                const asYouType = new AsYouType(countryIso2.toUpperCase() as CountryCode);

                const newValue = asYouType ? asYouType.input(inputValue) : inputValue;

                setCountryIso2(iso2);

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
                            setValue(country.iso2, inputValue);
                            break;
                        }

                        if (countryIso2 === country.iso2) {
                            setValue(country.iso2, inputValue);
                            break;
                            // If not equal — set highest by priority
                        } else if (country.priority === 0) {
                            setValue(country.iso2, inputValue);
                            break;
                        }
                    }
                }
            },
            [countryIso2, setValue],
        );

        useEffect(() => {
            setCountryByIso2(DEFAULT_COUNTRY_ISO_2);
        }, [setCountryByIso2]);

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length < MAX_DIAL_CODE_LENGTH) {
                    setCountryByDialCode(event.target.value);
                } else {
                    setValue(countryIso2, event.target.value);
                }
            },
            [setCountryByDialCode, setValue, countryIso2],
        );

        const handleSelectChange = useCallback(
            (_, payload) => {
                const country = setCountryByIso2(payload.value);
                const inputValue = `+${country.dialCode}`;

                // Wait for select blur, then focus on input
                timerRef.current = window.setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
                    }
                }, 0);
            },
            [setCountryByIso2],
        );

        const SelectedCountryFlag = countriesFlags[countryIso2];

        return (
            <Input
                {...props}
                onChange={handleInputChange}
                value={value}
                type='tel'
                ref={inputRef}
                className={cn(className, styles[size])}
                leftAddons={
                    <Select
                        disabled={disabled}
                        size={size}
                        options={[
                            {
                                value: 'ru',
                                text: (
                                    <div>
                                        <span>{countriesMap.ru.name}</span>
                                        <span>+7</span>
                                        <countriesFlags.ru />
                                    </div>
                                ),
                            },
                            {
                                value: 'az',
                                text: (
                                    <div>
                                        <span>{countriesMap.az.name}</span>
                                        <span>+994</span>
                                        <countriesFlags.az />
                                    </div>
                                ),
                            },
                        ]}
                        selected={{ value: countryIso2 }}
                        Field={fieldProps => (
                            <SelectField
                                {...fieldProps}
                                open={selectOpen}
                                value={[{ value: countryIso2, text: <SelectedCountryFlag /> }]}
                            />
                        )}
                        className={styles.select}
                        onOpen={handleSelectOpen}
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
