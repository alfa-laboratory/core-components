import React, { FC } from 'react';
import { Header, HeaderProps } from './Component';

import styles from './mobile.module.css';

export type HeaderMobileProps = HeaderProps;

export const HeaderMobile: FC<HeaderMobileProps> = props => <Header styles={styles} {...props} />;
