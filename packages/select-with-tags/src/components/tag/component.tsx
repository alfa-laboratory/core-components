import React, { useCallback } from 'react';
import cn from 'classnames';
import { CloseSWhiteIcon } from '@alfalab/icons-classic';
import { Tag as CoreTag } from '@alfalab/core-components-tag';
import { TagComponent } from '../../types';
import styles from './index.module.css';

export const Tag: TagComponent = ({
    option: { content, key },
    onClick,
    handleDeleteTag,
    ...props
}) => {
    const handleClick = useCallback(() => {
        if (handleDeleteTag) {
            handleDeleteTag(key);
        }
    }, [handleDeleteTag, key]);

    return (
        <CoreTag
            key={key}
            size='xs'
            onClick={onClick}
            checked={!!handleDeleteTag}
            className={cn(styles.tag, { [styles.tagNoClose]: !handleDeleteTag })}
            {...props}
        >
            <span
                className={cn(styles.tagContentWrap, { [styles.collapseButton]: !handleDeleteTag })}
            >
                {content}
                {handleDeleteTag && (
                    <CloseSWhiteIcon className={styles.tagCross} onClick={handleClick} />
                )}
            </span>
        </CoreTag>
    );
};
