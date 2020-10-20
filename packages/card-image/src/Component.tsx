import React, { FC, useCallback, useState, useRef } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

const ASPECT_RATIO = 0.63;
const defaultWidth = 280;

export type CardImageProps = {
    /**
     * Идентификатор карты
     * (например: ER, GQ, SU)
     */
    cardId?: string;

    /**
     * Какие слои показывать, через запятую без пробелов
     * (полный набор: BACKGROUND,CARD_NUMBER,CARD_HOLDER,PAY_PASS,CHIP,LOGO,PAYMENT_SYSTEM,RESERVED_1,RESERVED_2,VALID_DATE)
     */
    layers?: string;

    /**
     * Ширина изображения
     */
    width?: number;

    /**
     * Скругление углов
     */
    rounded?: boolean;

    /**
     * Базовый URL сервиса с изображениями
     */
    baseUrl?: string;

    /**
     * Колбек, вызываемый при загрузке изображения
     */
    onLoad?: () => void;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Уникальный идентификатор блока
     */
    id?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const CardImage: FC<CardImageProps> = ({
    cardId,
    layers,
    width = defaultWidth,
    baseUrl,
    rounded,
    id,
    dataTestId,
    onLoad,
}) => {
    const [loaded, setLoaded] = useState(false);
    const image = useRef<HTMLImageElement>(null);
    const height = width * ASPECT_RATIO;
    const handleLoadedImage = useCallback(() => {
        setLoaded(true);
        if (onLoad) {
            onLoad();
        }
    }, [onLoad]);

    const cardImageUrl = `${baseUrl}${cardId}/images?layers=${layers}&width=${width}`;
    const cardImageUrl2x = `${baseUrl}${cardId}/images?layers=${layers}&width=${width * 2}`;

    return (
        <div
            className={cn(styles.cardImage, rounded && styles.rounded)}
            style={{
                width,
                height,
            }}
            id={id}
            data-test-id={dataTestId}
        >
            {cardId && (
                <img
                    ref={image}
                    className={cn(styles.image, loaded && styles.loaded)}
                    width={width}
                    height={height}
                    src={cardImageUrl}
                    srcSet={`${cardImageUrl2x} 2x`}
                    alt=''
                    onLoad={handleLoadedImage}
                />
            )}
        </div>
    );
};

CardImage.defaultProps = {
    layers:
        'BACKGROUND,CARD_NUMBER,CARD_HOLDER,PAY_PASS,CHIP,LOGO,PAYMENT_SYSTEM,RESERVED_1,RESERVED_2,VALID_DATE',
    width: defaultWidth,
    rounded: true,
    baseUrl: 'https://online.alfabank.ru/cards-images/cards/',
};
