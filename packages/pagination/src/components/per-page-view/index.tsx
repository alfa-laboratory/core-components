import React, { FC } from 'react';

import { PaginationProps } from '../../Component';

import styles from './index.module.css';

type PerPageViewProps = Pick<PaginationProps, 'pagesCount' | 'currentPageIndex'>;

export const PerPageView: FC<PerPageViewProps> = ({ pagesCount, currentPageIndex }) => (
    <span className={styles.component}>
        {currentPageIndex + 1} из {pagesCount} страниц
    </span>
);
