import React, { FC, ReactNode } from 'react';

import styles from './index.module.css';

type Props = {
    content: ReactNode;
};

export const Changelog: FC<Props> = ({ content }) => {
    return <div className={styles.changelog}>{content}</div>;
};
