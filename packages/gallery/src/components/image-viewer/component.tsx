import React, {
    FC,
    KeyboardEventHandler,
    useContext,
    useRef,
    SyntheticEvent,
    useMemo,
    useCallback,
    MouseEventHandler,
    useEffect,
} from 'react';
import SwiperCore, { A11y, EffectFade, Controller } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from 'classnames';
import elementClosest from 'element-closest';
import 'swiper/swiper.min.css';

import { useFocus } from '@alfalab/hooks';
import { ChevronBackHeavyMIcon } from '@alfalab/icons-glyph/ChevronBackHeavyMIcon';
import { ChevronForwardHeavyMIcon } from '@alfalab/icons-glyph/ChevronForwardHeavyMIcon';

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
        initialSlide,
        onClose,
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
        setCurrentSlideIndex(swiper?.activeIndex || initialSlide);
    }, [setCurrentSlideIndex, swiper, initialSlide]);

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

    const handleWrapperClick = useCallback<MouseEventHandler>(
        event => {
            const eventTarget = event.target as HTMLElement;

            const isArrow =
                leftArrowRef.current?.contains(eventTarget) ||
                rightArrowRef.current?.contains(eventTarget);

            const isPlaceholder = Boolean(eventTarget.closest(`.${styles.placeholder}`));

            const isImg = eventTarget.tagName === 'IMG';

            if (!isImg && !isPlaceholder && !isArrow) {
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        elementClosest(window);
    }, []);

    const swiperProps = useMemo<Swiper>(
        () => ({
            slidesPerView: 1,
            effect: 'fade',
            className: cn(styles.swiper, { [styles.hidden]: fullScreen }),
            controller: { control: swiper },
            a11y: {
                slideRole: 'img',
            },
            initialSlide,
            simulateTouch: false,
            onSwiper: setSwiper,
            onSlideChange: handleSlideChange,
        }),
        [swiper, fullScreen, initialSlide, handleSlideChange, setSwiper],
    );

    const showControls = !singleSlide && !fullScreen;

    const swiperWidth = swiper?.width || 1;
    const swiperHeight = swiper?.height || 1;

    const swiperAspectRatio = swiperWidth / swiperHeight;

    const currentImage = getCurrentImage();

    return (
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        <div
            className={cn(styles.component, { [styles.singleSlide]: singleSlide })}
            onClick={handleWrapperClick}
        >
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
                    <ChevronBackHeavyMIcon />
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

                    const imageWidth = meta?.width || 1;
                    const imageHeight = meta?.height || 1;

                    const imageAspectRatio = imageWidth / imageHeight;

                    const slideVisible = index === currentSlideIndex;

                    return (
                        <SwiperSlide
                            key={getImageKey(image, index)}
                            style={{ pointerEvents: slideVisible ? 'auto' : 'none' }}
                        >
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
                    <ChevronForwardHeavyMIcon />
                </div>
            )}
        </div>
    );
};
