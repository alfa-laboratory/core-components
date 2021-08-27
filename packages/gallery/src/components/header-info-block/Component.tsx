import React from 'react';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';
import { splitFilename } from '../../utils';

export type Props = {
    filename: string;
    description?: string;
};

export const HeaderInfoBlock: React.FunctionComponent<Props> = ({ filename, description }) => {
    const [head, tail] = splitFilename(filename);

    return (
        <div className={styles.info}>
            <span className={styles.filenameContainer}>
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
            </span>

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
