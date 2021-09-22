import React, { FC } from 'react';
import { Typography } from '@alfalab/core-components-typography';

import { splitFilename } from '../../utils';

import styles from './index.module.css';

export type HeaderInfoBlockProps = {
    filename: string;
    description?: string;
};

export const HeaderInfoBlock: FC<HeaderInfoBlockProps> = ({ filename, description }) => {
    const [head, tail] = splitFilename(filename);

    return (
        <div className={styles.info}>
            <div className={styles.filenameContainer}>
                <Typography.Title
                    tag='h1'
                    className={styles.filenameHead}
                    view='xsmall'
                    font='system'
                    color='primary-inverted'
                >
                    {head}
                </Typography.Title>

                <Typography.Title tag='h1' view='xsmall' font='system' color='primary-inverted'>
                    {tail}
                </Typography.Title>
            </div>

            {description ? (
                <Typography.Text
                    className={styles.description}
                    tag='div'
                    view='primary-medium'
                    color='secondary-inverted'
                >
                    {description}
                </Typography.Text>
            ) : null}
        </div>
    );
};
