import React, { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type HeaderProps = {
    month?: string;

    year?: string;

    view?: 'month-only' | 'full';

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
    prevArrowVisible = true,
    nextArrowVisible = true,
    onPrevArrowClick,
    onNextArrowClick,

    onMonthClick,
    onYearClick,
}) => {
    return (
        <div className={cn(styles.header)}>
            {prevArrowVisible && (
                <Button view='ghost' onClick={onPrevArrowClick}>
                    Prev
                </Button>
            )}

            <Button size='xs' onClick={onMonthClick}>
                {month}
            </Button>

            {view === 'full' && (
                <Button size='xs' onClick={onYearClick}>
                    {year}
                </Button>
            )}

            {nextArrowVisible && (
                <Button view='ghost' onClick={onNextArrowClick}>
                    Next
                </Button>
            )}
        </div>
    );
};
