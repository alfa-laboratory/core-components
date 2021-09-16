import React, { FC, KeyboardEventHandler, useContext, useRef } from 'react';
import cn from 'classnames';

import { useFocus } from '@alfalab/hooks';

import { GalleryImage } from '../../types';
import { GalleryContext } from '../../context';

import styles from './index.module.css';

type Props = {
    image: GalleryImage;
    index: number;
    active?: boolean;
    onSelect: (index: number) => void;
    className: string;
};

export const ImagePreview: FC<Props> = ({ image, active = false, index, onSelect, className }) => {
    const { imagesMeta } = useContext(GalleryContext);

    const ref = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        onSelect(index);
    };

    const handleKeyDown: KeyboardEventHandler = event => {
        if (event.key === 'Enter') {
            onSelect(index);
        }
    };

    const [focused] = useFocus(ref, 'keyboard');

    const meta = imagesMeta[index];

    const isBroken = Boolean(meta?.broken);

    return (
        <div
            className={cn(
                styles.component,
                { [styles.active]: active, [styles.focused]: focused },
                className,
            )}
            onClick={handleClick}
            role='button'
            onKeyDown={handleKeyDown}
            tabIndex={0}
            ref={ref}
            aria-label={`Перейти к изображению ${index + 1}`}
        >
            {isBroken ? (
                <div className={cn(styles.preview, styles.brokenImageWrapper)}>
                    <div className={styles.brokenIcon} />
                </div>
            ) : (
                <div
                    className={cn(styles.preview, styles.image, {
                        [styles.broken]: isBroken,
                        [styles.loading]: !meta,
                    })}
                    style={{ backgroundImage: `url(${image.src})` }}
                />
            )}
        </div>
    );
};
