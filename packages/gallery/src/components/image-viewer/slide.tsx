import React, { FC } from 'react';
import cn from 'classnames';

import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

type SlideProps = {
    active: boolean;
    broken: boolean;
    withPlaceholder: boolean;
    loading: boolean;
};

export const Slide: FC<SlideProps> = ({ children, active, withPlaceholder, broken, loading }) => {
    return (
        <div
            className={cn(styles.slide, { [styles.slideLoading]: loading })}
            style={{
                opacity: Number(active),
            }}
        >
            {withPlaceholder && <div className={styles.placeholder} />}

            {broken ? (
                <div className={styles.brokenImgWrapper}>
                    <div className={styles.brokenImgIcon} />

                    <Typography.Text view='primary-small' color='secondary'>
                        Не удалось загрузить изображение
                    </Typography.Text>
                </div>
            ) : (
                children
            )}
        </div>
    );
};
