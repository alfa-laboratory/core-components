import React, { FC } from 'react';
import cn from 'classnames';
import { Footer, FooterProps } from './Component';

import styles from './mobile.module.css';

export type FooterMobileProps = FooterProps;

export const FooterMobile: FC<FooterMobileProps> = ({ className, sticky, ...restProps }) => (
    <Footer
        className={cn(className, styles.footer, {
            [styles.sticky]: sticky,
        })}
        sticky={sticky}
        {...restProps}
    />
);
