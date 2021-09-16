import React, { FC, KeyboardEventHandler, useCallback, useContext, useEffect, useRef } from 'react';

import { ImagePreview } from '../image-preview';
import styles from './index.module.css';

import { getImageKey } from '../../utils';
import { GalleryContext } from '../../context';

const MIN_SCROLL_STEP = 24;

export const NavigationBar: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { images, currentSlideIndex, setCurrentSlideIndex, getSwiper } = useContext(
        GalleryContext,
    );

    const swiper = getSwiper();

    const handlePreviewSelect = (index: number) => {
        setCurrentSlideIndex(index);

        if (swiper) {
            swiper.slideTo(index);
        }
    };

    const scroll = useCallback((scrollValue: number) => {
        if (containerRef.current) {
            containerRef.current.scroll({
                top: 0,
                left: containerRef.current.scrollLeft + scrollValue,
                behavior: 'smooth',
            });
        }
    }, []);

    const handlePreviewPosition = useCallback(
        (preview: Element, containerWidth: number) => {
            const { right, left } = preview.getBoundingClientRect();

            if (right > containerWidth) {
                const scrollValue = right - containerWidth + MIN_SCROLL_STEP;

                scroll(scrollValue);
            } else if (left < 0) {
                const scrollValue = left - MIN_SCROLL_STEP;

                scroll(scrollValue);
            }
        },
        [scroll],
    );

    const handleKeyDown: KeyboardEventHandler = event => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            const { width: containerWidth } = containerRef.current.getBoundingClientRect();

            const activePreview = containerRef.current.children[currentSlideIndex];

            if (activePreview) {
                handlePreviewPosition(activePreview, containerWidth);
            }
        }
    }, [currentSlideIndex, handlePreviewPosition, scroll]);

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div className={styles.component} ref={containerRef} onKeyDown={handleKeyDown}>
            {images.map((image, index) => {
                const active = index === currentSlideIndex;

                return (
                    <ImagePreview
                        key={getImageKey(image, index)}
                        image={image}
                        active={active}
                        index={index}
                        onSelect={handlePreviewSelect}
                        className={styles.preview}
                    />
                );
            })}
        </div>
    );
};
