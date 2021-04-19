import React, { FC } from 'react';
import { Footer, FooterProps } from './Component';

import styles from './mobile.module.css';

export type FooterMobileProps = FooterProps;

export const FooterMobile: FC<FooterMobileProps> = props => <Footer styles={styles} {...props} />;
