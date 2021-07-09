import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Container.module.css';

type ContainerProps = {
    children?: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'stretch';
};

export const Container: React.FC<ContainerProps> = ({ align = 'left', className, children }) => (
    <div className={cn(styles.container, className, styles[align])}>{children}</div>
);
