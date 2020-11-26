import React, { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';
import { SelectButton } from '../select-button';

export type HeaderProps = {
    month?: string;

    year?: string;

    view?: 'month-only' | 'full';

    withShadow?: boolean;

    prevArrowVisible?: boolean;
    nextArrowVisible?: boolean;

    onPrevArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onNextArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    onMonthClick?: (event: MouseEvent<HTMLButtonElement>) => void;
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
