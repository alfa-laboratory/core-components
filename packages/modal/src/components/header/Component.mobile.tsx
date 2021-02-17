import React from 'react';
import cn from 'classnames';
import { Header, HeaderProps } from './Component';

import styles from './mobile.module.css';

export type HeaderMobileProps = HeaderProps;

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ className, ...restProps }) => (
    <Header className={cn(className, styles.header)} {...restProps} />
);
