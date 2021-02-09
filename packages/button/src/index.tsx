import React, { forwardRef } from 'react';
import { Button as ButtonBase, ButtonProps } from './Component';

import styles from './index.module.css';

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>((props, ref) => {
    return <ButtonBase {...props} ref={ref} styles={styles} />;
});

export { Button, ButtonProps };
