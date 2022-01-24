import React, { forwardRef, RefAttributes, useCallback, useEffect, useRef } from 'react';

import { Button } from '@alfalab/core-components-button';
import { OptionShape, OptionsListProps } from '../../../typings';
import { OptionsList as DefaultOptionsList } from '../../../components';

import { SELECT_ALL_KEY } from '../hook';

import styles from './index.module.css';

type OptionsListWithApplyProps = OptionsListProps & {
    showClear?: boolean;
    onApply?: () => void;
    onClear?: () => void;
    onClose?: () => void;
    selectedDraft?: OptionShape[];
    OptionsList?: React.FC<OptionsListProps & RefAttributes<unknown>>;
};

export const OptionsListWithApply = forwardRef(
    (
        {
            toggleMenu,
            OptionsList = DefaultOptionsList,
            getOptionProps: defaultGetOptionProps,
            showClear = true,
            selectedDraft = [],
            flatOptions = [],
            onApply = () => null,
            onClear = () => null,
            onClose = () => null,
            ...restProps
        }: OptionsListWithApplyProps,
        ref,
    ) => {
        const footerRef = useRef<HTMLDivElement>(null);

        const getOptionProps = useCallback(
            (option: OptionShape, index: number) => {
                const optionProps = defaultGetOptionProps(option, index);

                const selected =
                    option.key === SELECT_ALL_KEY
                        ? selectedDraft.length === flatOptions.length - 1
                        : selectedDraft.includes(option);

                return {
                    ...optionProps,
                    selected,
                };
            },
            [defaultGetOptionProps, flatOptions.length, selectedDraft],
        );

        const handleApply = useCallback(() => {
            onApply();

            toggleMenu();
        }, [onApply, toggleMenu]);

        const handleClear = useCallback(() => {
            onClear();
        }, [onClear]);

        useEffect(() => {
            const activeElement = document.activeElement as HTMLElement;

            setTimeout(() => {
                if (footerRef.current) {
                    footerRef.current.focus();
                }
            }, 0);

            return () => {
                onClose();
                if (activeElement) {
                    activeElement.focus();
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <OptionsList
                {...restProps}
                ref={ref}
                toggleMenu={toggleMenu}
                flatOptions={flatOptions}
                getOptionProps={getOptionProps}
                footer={
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    <div className={styles.footer} tabIndex={0} ref={footerRef}>
                        <Button size='xxs' view='primary' onClick={handleApply}>
                            Применить
                        </Button>

                        {showClear && (
                            <Button size='xxs' view='secondary' onClick={handleClear}>
                                Сбросить
                            </Button>
                        )}
                    </div>
                }
            />
        );
    },
);
