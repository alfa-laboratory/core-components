import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import cn from 'classnames';

import { Button, ComponentProps } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type IconButtonProps = ComponentProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        icon: ElementType<{ className?: string }>;

        view?: 'primary' | 'secondary' | 'transparent';

        size?: 's' | 'm';
    };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, view = 'primary', size = 's' }, ref) => {
        return (
            <Button
                ref={ref}
                view='ghost'
                className={cn(className, styles[view])}
                leftAddons={
                    <span className={cn(styles.iconWrapper, styles[size])}>
                        <Icon className={styles.icon} />
                    </span>
                }
            />
        );
    },
);
