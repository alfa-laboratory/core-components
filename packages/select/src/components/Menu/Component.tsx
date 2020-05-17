import React from 'react';
import { ItemShape, MenuProps } from '../../Component';

import styles from './index.module.css';

export const Menu = <T extends ItemShape>({ children, isOpen, items }: MenuProps<T>) => {
    return isOpen ? (
        <div className={styles.menu}>{items.map((item, index) => children({ item, index }))}</div>
    ) : null;
};
