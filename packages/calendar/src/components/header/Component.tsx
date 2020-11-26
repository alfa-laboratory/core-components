import React, { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';
import { SelectButton } from '../select-button';

export type HeaderProps = {
    /**
     * Выбранный месяц
     */
    month?: string;

    /**
     * Выбранный год
     */
    year?: string;

    /**
     * Вид шапки — месяц и год или только месяц
     */
    view?: 'month-only' | 'full';

    /**
     * Отображать тень? (нужна при прокрутке)
     */
    withShadow?: boolean;

    /**
     * Показывать кнопку переключения на пред. месяц?
     */
    prevArrowVisible?: boolean;

    /**
     * Показывать кнопку переключения на след. месяц?
     */
    nextArrowVisible?: boolean;

    /**
     * Обработчик нажатия кнопки переключения на пред. месяц
     */
    onPrevArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия кнопки переключения на след. месяц
     */
    onNextArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия на кнопку месяца
     */
    onMonthClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия на кнопку года
     */
    onYearClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: FC<HeaderProps> = ({
    month,
    year,
    view = 'full',
    withShadow,
    prevArrowVisible = true,
    nextArrowVisible = true,
    onPrevArrowClick,
    onNextArrowClick,
    onMonthClick,
    onYearClick,
}) => {
    return (
        <div
            className={cn(styles.header, {
                [styles.monthOnly]: view === 'month-only',
                [styles.withShadow]: withShadow,
            })}
            aria-live='polite'
        >
            <div className={styles.inner}>
                {prevArrowVisible && (
                    <Button
                        view='ghost'
                        className={styles.arrow}
                        onClick={onPrevArrowClick}
                        aria-label='Предыдущий месяц'
                    />
                )}

                {view === 'full' ? (
                    <React.Fragment>
                        <SelectButton
                            view='filled'
                            className={cn(styles.button, styles.month)}
                            onClick={onMonthClick}
                        >
                            <span className={styles.buttonContent}>
                                {month}
                                <span className={styles.upDownIcon} />
                            </span>
                        </SelectButton>
                        <SelectButton
                            view='filled'
                            className={cn(styles.button, styles.year)}
                            onClick={onYearClick}
                        >
                            <span className={styles.buttonContent}>
                                {year}
                                <span className={styles.upDownIcon} />
                            </span>
                        </SelectButton>
                    </React.Fragment>
                ) : (
                    <span className={cn(styles.button, styles.month)}>{month}</span>
                )}

                {nextArrowVisible && (
                    <Button
                        view='ghost'
                        className={styles.arrow}
                        onClick={onNextArrowClick}
                        aria-label='Следующий месяц'
                    />
                )}
            </div>
        </div>
    );
};
