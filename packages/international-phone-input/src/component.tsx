import React, {
    forwardRef,
    useState,
    useEffect,
    useCallback,
    ChangeEvent,
    useRef,
    useImperativeHandle,
} from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';

// TODO: dynamic import
import { AsYouType, CountryCode } from 'libphonenumber-js';

import { getCountries, getCountriesMap } from './countries';
import { CountrySelect } from './components';

export type InternationalPhoneInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
};

const DEFAULT_COUNTRY_ISO_2 = 'ru';
const DEFAULT_VALUE = '+7';

const MAX_DIAL_CODE_LENGTH = 4;

const countries = getCountries();
const countriesMap = getCountriesMap();

export const InternationalPhoneInput = forwardRef<HTMLInputElement, InternationalPhoneInputProps>(
    (props, ref) => {
        const { disabled = false, size = 'm', className, value = DEFAULT_VALUE, onChange } = props;

        const [countryIso2, setCountryIso2] = useState(DEFAULT_COUNTRY_ISO_2);

        const timerRef = useRef(0);

        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

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
            payload => {
                const country = setCountryByIso2(payload.selected[0]);
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

        return (
            <Input
                {...props}
                onChange={handleInputChange}
                value={value}
                type='tel'
                ref={inputRef}
                className={className}
                leftAddons={
                    <CountrySelect
                        disabled={disabled}
                        size={size}
                        selected={countryIso2}
                        countriesMap={countriesMap}
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
