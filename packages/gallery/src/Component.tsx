import React from 'react';

// import { ControlBar, NavigationBar } from './components';

import styles from './index.module.css';

export const Gallery: React.FunctionComponent<any> = () => {
    return (
        // Подумать над Base<BaseModal>
        <div className={styles.container}>
            {/* <ControlBar filename='ContrBarControlBarControl.jsx' description='Изображение 1 из 8' /> */}
            {/* <NavigationBar /> */}
        </div>
    );
};
