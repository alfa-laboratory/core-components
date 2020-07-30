import React, { useCallback, MouseEvent, ReactNode, useState, ChangeEvent } from 'react';
import cn from 'classnames';
import { MaskedInput } from '@alfalab/core-components-masked-input';
import {
    BankAlfaLBlackIcon,
    CardVisaXxlBlackIcon,
    CardMirXxlBlackIcon,
    CardMastercardXxlBlackIcon,
} from '@alfalab/icons-classic';

import styles from './index.module.css';
import { validateCardNumber } from './utils';

export type BankCardProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Цвет фона карты
     */
    backgroundColor?: string;

    /**
     * Иконка логотипа банка (размер L)
     */
    bankLogo?: ReactNode;

    /**
     * Лэйбл поля ввода
     */
    inputLabel?: string;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Обработчик ввода
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Обработчик вызова камеры
     */
    onUsePhoto?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

// prettier-ignore
const cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
// prettier-ignore
const accountNumberMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

const getBrandIcon = (value = '') => {
    // Показываем логотип только после ввода всех цифр карты
    if (value.length === cardMask.length && validateCardNumber(value)) {
        if (value.startsWith('2')) return <CardMirXxlBlackIcon />;
        if (value.startsWith('4')) return <CardVisaXxlBlackIcon />;
        if (value.startsWith('5')) return <CardMastercardXxlBlackIcon />;
    }
    return null;
};

// TODO: затащить в icons
const CameraMBlackIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M7.77208 4.68377C7.90819 4.27543 8.29033 4 8.72076 4H15.2792C15.7097 4 16.0918 4.27543 16.2279 4.68377L17 7H20C20.5523 7 21 7.44772 21 8V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V8C3 7.44772 3.44772 7 4 7H7L7.77208 4.68377ZM12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z'
            fill='black'
        />
    </svg>
);

/**
 * TODO:
 * 1. Иконки фото нет в наборах
 * 2. Инпут отличается от дизайн-системы (проблематично убрать отступы по бокам)
 * 3. ховер\нажатие кнопки?
 * 4. размеры\адаптивность?
 */

export const BankCard = React.forwardRef<HTMLInputElement, BankCardProps>(
    (
        {
            bankLogo = <BankAlfaLBlackIcon />,
            backgroundColor = '#EF3124',
            inputLabel = 'Номер карты или счёта',
            value,
            className,
            onUsePhoto,
            onChange,
            dataTestId,
        },
        ref,
    ) => {
        const [focused, setFocused] = useState(false);
        const [filled, setFilled] = useState(value !== undefined && value !== '');

        const [brandIcon, setBrandIcon] = useState<ReactNode>(getBrandIcon(value));

        const getMask = (newValue: string) =>
            newValue.length <= cardMask.length ? cardMask : accountNumberMask;

        const handleInputChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                setFilled(event.target.value !== '');

                setBrandIcon(getBrandIcon(event.target.value));

                if (onChange) {
                    onChange(event);
                }
            },
            [onChange],
        );

        const handleInputFocus = useCallback(() => {
            setFocused(true);
        }, []);

        const handleInputBlur = useCallback(() => {
            setFocused(false);
        }, []);

        const renderRightAddons = useCallback(() => {
            return (
                <button type='button' className={styles.usePhoto} onClick={onUsePhoto}>
                    <CameraMBlackIcon />
                </button>
            );
        }, [onUsePhoto]);

        return (
            <div
                className={cn(styles.component, className, {
                    [styles.focused]: focused,
                    [styles.filled]: filled,
                })}
                style={{ backgroundColor }}
            >
                <div className={styles.container}>
                    <div className={styles.bankLogo}>{bankLogo}</div>

                    <MaskedInput
                        ref={ref}
                        value={value}
                        mask={getMask}
                        block={true}
                        label={inputLabel}
                        rightAddons={renderRightAddons()}
                        inputClassName={styles.input}
                        labelClassName={styles.label}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        dataTestId={dataTestId}
                    />

                    {brandIcon && <div className={styles.brandLogo}>{brandIcon}</div>}
                </div>
            </div>
        );
    },
);
