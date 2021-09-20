import React, { FC, useContext, useEffect, useRef } from 'react';

import { HeaderInfoBlock } from '../header-info-block';
import * as Buttons from './buttons';
import { isSmallImage } from '../../utils';
import { GalleryContext } from '../../context';

import styles from './index.module.css';

export const Header: FC = () => {
    const {
        currentSlideIndex,
        singleSlide,
        images,
        fullScreen,
        getCurrentImageMeta,
        getCurrentImage,
        setFullScreen,
        onClose,
    } = useContext(GalleryContext);

    const toggleFullScreenButton = useRef<HTMLButtonElement>(null);

    const closeFullScreen = () => {
        setFullScreen(false);
    };

    const openFullScreen = () => {
        setFullScreen(true);
    };

    useEffect(() => {
        if (toggleFullScreenButton.current) {
            toggleFullScreenButton.current.focus();
        }
    }, [fullScreen]);

    const currentImage = getCurrentImage();

    const canDownload = currentImage?.canDownload ?? true;
    const filename = currentImage?.name || '';
    const description = singleSlide
        ? ''
        : `Изображение ${currentSlideIndex + 1} из ${images.length}`;

    const meta = getCurrentImageMeta();

    const showFullScreenButton = !isSmallImage(meta) && !meta?.broken;
    const showDownloadButton = !meta?.broken && canDownload;

    const renderToggleFullScreenButton = () =>
        fullScreen ? (
            <Buttons.ExitFullscreen onClick={closeFullScreen} buttonRef={toggleFullScreenButton} />
        ) : (
            <Buttons.Fullscreen onClick={openFullScreen} buttonRef={toggleFullScreenButton} />
        );

    return (
        <div className={styles.component}>
            <HeaderInfoBlock filename={filename} description={description} />

            <div className={styles.buttons}>
                {showFullScreenButton && renderToggleFullScreenButton()}

                {showDownloadButton && (
                    <Buttons.Download href={currentImage?.src} download={currentImage?.name} />
                )}

                <Buttons.Exit onClick={onClose} />
            </div>
        </div>
    );
};
