import React from 'react';
import { Tag } from '@alfalab/core-components-tag';
import { CrossCompactMIcon } from '@alfalab/icons-glyph';

import { RenderTagFunction } from '../../types';

import styles from './index.module.css';

export const renderTag: RenderTagFunction = ({ option: { content, key }, handleDeleteTag }) => {
    return (
        <Tag key={key} size='xs' checked={true} className={styles.tag}>
            <span className={styles.tagContentWrap}>
                {content}

                <CrossCompactMIcon
                    onClick={() => {
                        if (handleDeleteTag) {
                            handleDeleteTag(key);
                        }
                    }}
                    className={styles.tagCross}
                />
            </span>
        </Tag>
    );
};
