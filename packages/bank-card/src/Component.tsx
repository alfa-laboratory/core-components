import React, { useCallback, MouseEvent, ReactNode, useState, ChangeEvent } from 'react';
import cn from 'classnames';
import { MaskedInput } from '@alfalab/core-components-masked-input';
import {
    BankAlfaLBlackIcon,
    CardVisaXxlBlackIcon,
    CardMirXxlBlackIcon,
    CardMastercardXxlBlackIcon,
} from '@alfalab/icons-classic';

import { CameraMIcon } from '@alfalab/icons-glyph';

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
                    <CameraMIcon />
                </button>
            );
        }, [onUsePhoto]);

        return (
            <div
                className={cn(styles.component, className, {
                    [styles.focused]: focused,
                    [styles.filled]: filled,
                })}
            >
                <div className={styles.aspectRatioContainer}>
                    <div className={styles.content} style={{ backgroundColor }}>
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
            </div>
        );
    },
);

BankCard.defaultProps = {
    bankLogo: <BankAlfaLBlackIcon />,
    backgroundColor: '#EF3124',
    inputLabel: 'Номер карты или счёта',
};
