import React from 'react';

import { HeaderInfoBlock } from '../header-info-block';
import * as Buttons from './buttons';
import styles from './index.module.css';

export type Props = {
    filename: string;
    description?: string;
};

export const Header: React.FunctionComponent<Props> = ({ filename, description }) => {
    return (
        <div className={styles.container}>
            <HeaderInfoBlock filename={filename} description={description} />
            <div className={styles.buttons}>
                <Buttons.Fullscreen />
                <Buttons.Download />
                <Buttons.Exit />
            </div>
        </div>
    );
};
