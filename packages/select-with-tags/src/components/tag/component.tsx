import React, { useCallback } from 'react';
import { Tag as CoreTag } from '@alfalab/core-components-tag';
import { CrossCompactMIcon } from '@alfalab/icons-glyph';

import { TagComponent } from '../../types';

import styles from './index.module.css';

export const Tag: TagComponent = ({ option: { content, key }, handleDeleteTag }) => {
    const handleClick = useCallback(() => {
        if (handleDeleteTag) {
            handleDeleteTag(key);
        }
    }, [handleDeleteTag, key]);

    return (
        <CoreTag key={key} size='xs' checked={true} className={styles.tag}>
            <span className={styles.tagContentWrap}>
                {content}

                <CrossCompactMIcon onClick={handleClick} className={styles.tagCross} />
            </span>
        </CoreTag>
    );
};
