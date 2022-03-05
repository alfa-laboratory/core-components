import React, { FC } from 'react';
import cn from 'classnames';
import CrossMIcon from '@alfalab/icons-glyph/CrossMIcon';
import { Header, HeaderProps } from './Component';
import { Closer } from '../closer/Component';

import styles from './mobile.module.css';

export type HeaderMobileProps = Omit<HeaderProps, 'closer'> & {
    /**
     * Наличие крестика
     */
    hasCloser?: boolean;
};

export const HeaderMobile: FC<HeaderMobileProps> = ({
    className,
    contentClassName,
    hasCloser = true,
    sticky,
    ...restProps
}) => (
    <Header
        className={cn(className, {
            [styles.sticky]: sticky,
        })}
        contentClassName={cn(styles.content, contentClassName)}
        closer={hasCloser ? <Closer icon={CrossMIcon} size='xs' /> : null}
        sticky={sticky}
        {...restProps}
    />
);
