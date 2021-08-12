import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
    src: string;
    active?: boolean;
};

export const ImagePreview: React.FC<Props> = ({ src, active = false }) => {
    return (
        <ImageWrapper active={active}>
            <img src={src} alt='' className={cn(styles.imagePreview)} />
        </ImageWrapper>
    );
};

const ImageWrapper: React.FC<{ active: boolean }> = ({ active, children }) => {
    if (!active) return <React.Fragment>{children}</React.Fragment>;

    return <div className={styles.activeBorder}>{children}</div>;
};
