import React, { forwardRef } from 'react';

import { Button, ButtonProps } from '../../Component';

import styles from './index.module.css';

export const ButtonMobile = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button {...props} ref={ref} styles={styles} />;
    },
);
