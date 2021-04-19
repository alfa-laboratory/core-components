import React, { FC } from 'react';
import { Content, ContentProps } from './Component';

import styles from './mobile.module.css';

export type ContentMobileProps = ContentProps;

export const ContentMobile: FC<ContentMobileProps> = props => (
    <Content styles={styles} {...props} />
);
