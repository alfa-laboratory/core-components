import React, {
    FC,
    KeyboardEventHandler,
    useContext,
    useRef,
    SyntheticEvent,
    useMemo,
    useCallback,
} from 'react';
import SwiperCore, { A11y, EffectFade, Controller } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from 'classnames';
import 'swiper/swiper.min.css';

import { useFocus } from '@alfalab/hooks';
import { ChevronBackMIcon } from '@alfalab/icons-glyph/ChevronBackMIcon';
import { ChevronForwardMIcon } from '@alfalab/icons-glyph/ChevronForwardMIcon';

import { GalleryContext } from '../../context';
import { getImageAlt, getImageKey, isSmallImage } from '../../utils';
import { Slide } from './slide';

import styles from './index.module.css';

SwiperCore.use([EffectFade, A11y, Controller]);

export const ImageViewer: FC = () => {
    const {
        singleSlide,
        images,
        imagesMeta,
        fullScreen,
        currentSlideIndex,
        getCurrentImage,
        setImageMeta,
        setCurrentSlideIndex,
        getSwiper,
        setSwiper,
        slidePrev,
        slideNext,
    } = useContext(GalleryContext);

    const leftArrowRef = useRef<HTMLDivElement>(null);
    const rightArrowRef = useRef<HTMLDivElement>(null);

    const [leftArrowFocused] = useFocus(leftArrowRef, 'keyboard');
    const [rightArrowFocused] = useFocus(rightArrowRef, 'keyboard');

    const swiper = getSwiper();

    const handleSlideChange = useCallback(() => {
        if (swiper) {
            setCurrentSlideIndex(swiper.activeIndex);
        }
    }, [setCurrentSlideIndex, swiper]);

    const handlePrevClick = () => {
        slidePrev();
    };

    const handleNextClick = () => {
        slideNext();
    };

    const handleArrowLeftKeyDown: KeyboardEventHandler = event => {
        if (event.key === 'Enter') {
            slidePrev();
        }
    };

    const handleArrowRightKeyDown: KeyboardEventHandler = event => {
        if (event.key === 'Enter') {
            slideNext();
        }
    };

    const handleLoad = (event: SyntheticEvent<HTMLImageElement>, index: number) => {
        const target = event.currentTarget;

        const { naturalWidth, naturalHeight } = target;

        setImageMeta({ width: naturalWidth, height: naturalHeight }, index);
    };

    const handleLoadError = (index: number) => {
        setImageMeta({ width: 0, height: 0, broken: true }, index);
    };

    const swiperProps = useMemo<Swiper>(
        () => ({
            slidesPerView: 1,
            effect: 'fade',
            className: cn(styles.swiper, { [styles.hidden]: fullScreen }),
            controller: { control: swiper },
            a11y: {
                slideRole: 'img',
            },
            onSwiper: setSwiper,
            onSlideChange: handleSlideChange,
        }),
        [swiper, fullScreen, handleSlideChange, setSwiper],
    );

    const showControls = !singleSlide && !fullScreen;

    const swiperWidth = swiper?.width || 1;
    const swiperHeight = swiper?.height || 1;

    const swiperAspectRatio = swiperWidth / swiperHeight;

    const currentImage = getCurrentImage();

    return (
        <div className={styles.component}>
            {showControls && (
                <div
                    className={cn(styles.arrow, {
                        [styles.focused]: leftArrowFocused,
                    })}
                    onClick={handlePrevClick}
                    role='button'
                    onKeyDown={handleArrowLeftKeyDown}
                    tabIndex={0}
                    ref={leftArrowRef}
                    aria-label='Предыдущее изображение'
                >
                    <ChevronBackMIcon />
                </div>
            )}

            {fullScreen && (
                <img
                    src={currentImage?.src}
                    alt={currentImage ? getImageAlt(currentImage, currentSlideIndex) : ''}
                    className={styles.fullScreenImage}
                />
            )}

            <Swiper {...swiperProps}>
                {images.map((image, index) => {
                    const meta = imagesMeta[index];

                    const imageWidth = meta?.width || 0;
                    const imageHeight = meta?.height || 0;

                    const imageAspectRatio = imageWidth / imageHeight;

                    return (
                        <SwiperSlide key={getImageKey(image, index)}>
                            {({ isActive }) => {
                                const broken = Boolean(meta?.broken);
                                const small = isSmallImage(meta);
                                const verticalImageFit =
                                    !small && swiperAspectRatio > imageAspectRatio;
                                const horizontalImageFit =
                                    !small && swiperAspectRatio <= imageAspectRatio;

                                return (
                                    <Slide
                                        active={isActive}
                                        broken={broken}
                                        loading={!meta}
                                        withPlaceholder={small || broken}
                                    >
                                        <img
                                            src={image.src}
                                            alt={getImageAlt(image, index)}
                                            className={cn({
                                                [styles.smallImage]: small,
                                                [styles.image]: !small,
                                                [styles.verticalImageFit]: verticalImageFit,
                                                [styles.horizontalImageFit]: horizontalImageFit,
                                            })}
                                            onLoad={event => handleLoad(event, index)}
                                            onError={() => handleLoadError(index)}
                                            style={{
                                                maxHeight: `${swiperHeight}px`,
                                            }}
                                        />
                                    </Slide>
                                );
                            }}
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {showControls && (
                <div
                    className={cn(styles.arrow, {
                        [styles.focused]: rightArrowFocused,
                    })}
                    onClick={handleNextClick}
                    role='button'
                    onKeyDown={handleArrowRightKeyDown}
                    tabIndex={0}
                    ref={rightArrowRef}
                    aria-label='Следующее изображение'
                >
                    <ChevronForwardMIcon />
                </div>
            )}
        </div>
    );
};
