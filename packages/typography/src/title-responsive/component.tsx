import React, { FC } from 'react';

import { TitleProps, Title } from '../title/component';

import styles from './index.module.css';

export const TitleResponsive: FC<TitleProps> = props => {
    return <Title {...props} styles={styles} />;
};
