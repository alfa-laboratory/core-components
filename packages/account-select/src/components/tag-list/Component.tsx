import React, { memo, useMemo, useState } from 'react';
import { Tag } from '@alfalab/core-components-tag';
import { CloseSWhiteIcon } from '@alfalab/icons-classic';
import { Typography } from '@alfalab/core-components-typography';
import styles from './index.module.css';

type TagListProps = {
    selectedTags: string[];
    onDeleteTag: (tag: string) => void;
};

const NUMBER_OF_VISIBLE_ELEMENTS = 3;

export const TagList = memo<TagListProps>(({ selectedTags, onDeleteTag }) => {
    const [isShowMoreOpened, setShowMoreOpened] = useState(false);

    const showMoreOrLessTitle = useMemo(() => {
        const hiddenAccountsCount = selectedTags.length - NUMBER_OF_VISIBLE_ELEMENTS;
        let accountTitle = 'счетов';
        if (hiddenAccountsCount === 1) {
            accountTitle = 'счёт';
        } else if (hiddenAccountsCount > 1 && hiddenAccountsCount < 5) {
            accountTitle = 'счета';
        }
        let title = `${'ещё'} ${hiddenAccountsCount} ${accountTitle}`;
        if (selectedTags.length > NUMBER_OF_VISIBLE_ELEMENTS && isShowMoreOpened) {
            title = 'скрыть';
        }
        return title;
    }, [selectedTags, isShowMoreOpened]);

    const isShowMoreOrLessVisible = useMemo(
        () => selectedTags.length > NUMBER_OF_VISIBLE_ELEMENTS,
        [selectedTags],
    );

    const handleTagClick = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (event) {
            event.stopPropagation();
        }
    };

    const handleClickShowMore = () => {
        setShowMoreOpened(value => !value);
    };

    return (
        <div className={styles.container}>
            {selectedTags.map((tag, index) => {
                if (!isShowMoreOpened && index + 1 > NUMBER_OF_VISIBLE_ELEMENTS) {
                    return null;
                }
                return (
                    <Tag
                        size='xs'
                        key={tag}
                        checked={true}
                        className={styles.tag}
                        onClick={handleTagClick}
                        rightAddons={
                            <button
                                type='button'
                                onClick={() => onDeleteTag(tag)}
                                className={styles.closeIconButton}
                            >
                                <CloseSWhiteIcon />
                            </button>
                        }
                    >
                        {tag}
                    </Tag>
                );
            })}
            {isShowMoreOrLessVisible && (
                <button
                    type='button'
                    onClick={handleClickShowMore}
                    className={styles.moreLessButton}
                >
                    <Typography.Text view='secondary-large'>{showMoreOrLessTitle}</Typography.Text>
                </button>
            )}
        </div>
    );
});
