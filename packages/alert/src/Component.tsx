import React, { FC } from 'react';
import cn from 'classnames';

import { Plate, PlateProps } from '@alfalab/core-components-plate';

import styles from './index.module.css';

export type AlertProps = Omit<PlateProps, 'foldable' | 'defaultFolded' | 'leftAddons'>;

export const Alert: FC<AlertProps> = ({ className, title, children, ...restProps }) => (
    <Plate
        className={cn(styles.component, className)}
        buttonsClassName={styles.buttons}
        title={title ? <span className={styles.title}>{title}</span> : null}
        {...restProps}
    >
        <div className={styles.content}>{children}</div>
    </Plate>
);
