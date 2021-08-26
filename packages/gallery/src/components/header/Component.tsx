import React, { FC, useContext, useLayoutEffect, useRef } from 'react';

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

    const currentImage = getCurrentImage();

    const filename = currentImage?.name || '';
    const description = singleSlide
        ? ''
        : `Изображение ${currentSlideIndex + 1} из ${images.length}`;

    const meta = getCurrentImageMeta();

    useLayoutEffect(() => {
        if (toggleFullScreenButton.current) {
            toggleFullScreenButton.current.focus();
        }
    }, [fullScreen]);

    return (
        <div className={styles.component}>
            <HeaderInfoBlock filename={filename} description={description} />

            <div className={styles.buttons}>
                {fullScreen ? (
                    <Buttons.ExitFullscreen
                        onClick={closeFullScreen}
                        buttonRef={toggleFullScreenButton}
                    />
                ) : (
                    <Buttons.Fullscreen
                        onClick={openFullScreen}
                        disabled={isSmallImage(meta) || meta?.broken}
                        buttonRef={toggleFullScreenButton}
                    />
                )}

                <Buttons.Download
                    href={currentImage?.src}
                    download={currentImage?.name}
                    disabled={meta?.broken}
                    target="_blank"
                />

                <Buttons.Exit onClick={onClose} />
            </div>
        </div>
    );
};
