import React, { FC } from 'react';

import { TitleProps, Title } from '../title/component';

import commonStyles from '../title/common.module.css';
import styles from './index.module.css';

export type TitleMobileProps = Omit<TitleProps, 'defaultMargins'>;

export const TitleMobile: FC<TitleMobileProps> = props => {
    /**
     * Если поменять Object.assign на деструктуризацию, то упадут тесты.
     * Видимо, это особенность работы jest и css-modules.
     */
    return <Title {...props} styles={Object.assign(commonStyles, styles)} />;
};
