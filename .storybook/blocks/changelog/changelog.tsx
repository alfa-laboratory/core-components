import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
    content: ReactNode;
    root?: boolean;
};

export const Changelog: FC<Props> = ({ content, root = false }) => {
    return <div className={cn(styles.changelog, root && styles.root)}>{content}</div>;
};
