import React, { forwardRef, RefAttributes, useCallback, useEffect, useRef } from 'react';

import { OptionShape, OptionsListProps } from '../../../typings';
import { OptionsList as DefaultOptionsList } from '../../../components/select-mobile/options-list';

import { SELECT_ALL_KEY } from '../hook';

type OptionsListWithApplyProps = OptionsListProps & {
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

            toggleMenu();
        }, [onClear, toggleMenu]);

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
                onApply={handleApply}
                onClear={handleClear}
            />
        );
    },
);
