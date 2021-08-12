import React from 'react';

import { NavigationBar } from './components';

import styles from './index.module.css';

export const Gallery: React.FC = () => {
    return (
        // Подумать над Base<BaseModal>
        <div className={styles.container}>
            <NavigationBar />
        </div>
    );
};
