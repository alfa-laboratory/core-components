import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { OptionsListProps, OptionShape } from '../../typings';
import { OptionsList, VirtualOptionsList } from '..';

import styles from './index.module.css';

type OptionsListWithApplyProps = OptionsListProps & {
    virtual?: boolean;
};

export const OptionsListWithApply = forwardRef(
    (
        {
            selectedItems = [],
            setSelectedItems,
            className,
            getOptionProps: defaultGetOptionProps,
            toggleMenu,
            virtual = false,
            ...restProps
        }: OptionsListWithApplyProps,
        ref,
    ) => {
        const [selectedDraft, setSelectedDraft] = useState<OptionShape[]>(selectedItems);

        const getOptionProps = useCallback(
            (option: OptionShape, index: number) => {
                const optionProps = defaultGetOptionProps(option, index);

                const selected = selectedDraft.includes(option);

                const onClick = () => {
                    if (optionProps.multiple) {
                        setSelectedDraft(
                            selected
                                ? selectedDraft.filter(o => o !== option)
                                : selectedDraft.concat(option),
                        );
                    } else {
                        setSelectedDraft(selected ? [] : [option]);
                    }
                };

                return {
                    ...optionProps,
                    selected,
                    innerProps: {
                        ...optionProps.innerProps,
                        onClick,
                    },
                };
            },
            [defaultGetOptionProps, selectedDraft],
        );

        const handleApply = useCallback(() => {
            setSelectedItems(selectedDraft);

            toggleMenu();
        }, [selectedDraft, setSelectedItems, toggleMenu]);

        useEffect(() => {
            setSelectedDraft(selectedItems);
        }, [selectedItems]);

        const ListComponent = virtual ? VirtualOptionsList : OptionsList;

        return (
            <ListComponent
                {...restProps}
                className={cn(className, styles.component)}
                ref={ref}
                selectedItems={selectedItems}
                getOptionProps={getOptionProps}
                setSelectedItems={setSelectedItems}
                toggleMenu={toggleMenu}
                footer={
                    <div className={styles.footer}>
                        <Button size='xxs' view='primary' onClick={handleApply}>
                            Применить
                        </Button>
                    </div>
                }
            />
        );
    },
);
