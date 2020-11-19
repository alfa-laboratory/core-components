import React, { FC, useCallback } from 'react';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type YearsTableProps = {
    years?: Date[];

    onYearClick?: (year: Date) => void;
};

export const YearsTable: FC<YearsTableProps> = ({ years = [], onYearClick }) => {
    const handleYearClick = useCallback(
        (year: Date) => {
            if (onYearClick) onYearClick(year);
        },
        [onYearClick],
    );

    return (
        <div className={styles.yearsTable}>
            {years.map(year => (
                <Button size='xs' key={year.getFullYear()} onClick={() => handleYearClick(year)}>
                    {year.getFullYear()}
                </Button>
            ))}
        </div>
    );
};
