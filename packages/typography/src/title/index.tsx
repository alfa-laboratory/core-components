import React, { FC } from 'react';

import { Title as TitleBase, TitleProps } from './component';

import styles from './index.module.css';
import commonStyles from './common.module.css';

const Title: FC<TitleProps> = props => {
    /**
     * Если поменять Object.assign на деструктуризацию, то упадут тесты.
     * Видимо, это особенность работы jest и css-modules.
     */
    return <TitleBase {...props} styles={Object.assign(styles, commonStyles)} />;
};

export { Title, TitleProps };
