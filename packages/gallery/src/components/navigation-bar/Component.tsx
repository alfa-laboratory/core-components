import React from 'react';

import { ImagePreview } from '../image-preview';
import styles from './index.module.css';

export const NavigationBar: React.FC = () => {
    return (
        <div className={styles.container}>
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://interactive-exampls.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview src='https://picsum.photos/3000' />
            <ImagePreview active={true} src='https://picsum.photos/200' />
        </div>
    );
};
