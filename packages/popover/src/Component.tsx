import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import { usePopper } from 'react-popper';
import { BasePlacement, VariationPlacement, Obj } from '@popperjs/core';

import { Portal } from '@alfalab/core-components-portal';

import styles from './index.module.css';

type RefElement = HTMLElement | null;

export type Position = BasePlacement | VariationPlacement;

type PopperModifier = {
    name: string;
    options: Obj;
};

export type PopoverProps = {
    /**
     * Управление состоянием поповера (открыт/закрыт)
     */
    open: boolean;

    /**
     * Элемент, относительного которого появляется поповер
     */
    anchorElement: RefElement;

    /**
     * Позиционирование поповера
     */
    position?: Position;

    /**
     * Если `true`, будет отрисована стрелочка
     */
    withArrow?: boolean;

    /**
     * Смещение поповера
     */
    offset?: [number, number];

    /**
     * Дополнительные классы
     */
    classNames?: {
        /**
         * Дополнительный класс для поповера
         */
        popper?: string;

        /**
         * Дополнительный класс для стрелочки
         */
        arrow?: string;
    };

    /**
     * Функция, возвращающая контейнер, в который будет рендериться поповер
     */
    getPortalContainer?: () => HTMLElement;

    /**
     * Transition props, прокидываются в компонент Transition.
     * См. https://reactcommunity.org/react-transition-group/transition
     */
    transition?: TransitionProps;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

const TRANSITION_DURATION = 300;

export const Popover: React.FC<PopoverProps> = ({
    children,
    getPortalContainer,
    transition = {},
    anchorElement,
    offset = [0, 0],
    withArrow = false,
    position = 'left',
    classNames = {},
    open,
    dataTestId,
}) => {
    const [referenceElement, setReferenceElement] = useState<RefElement>(anchorElement);
    const [popperElement, setPopperElement] = useState<RefElement>(null);
    const [arrowElement, setArrowElement] = useState<RefElement>(null);

    const getModifiers = useCallback(() => {
        const modifiers: PopperModifier[] = [{ name: 'offset', options: { offset } }];

        if (withArrow) {
            modifiers.push({ name: 'arrow', options: { element: arrowElement } });
        }

        return modifiers;
    }, [withArrow, arrowElement, offset]);

    const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
        placement: position,
        modifiers: getModifiers(),
    });

    useEffect(() => {
        setReferenceElement(anchorElement);
    }, [anchorElement]);

    const getPopperClassName = useCallback(
        status => cn(styles.component, styles[status], classNames.popper, status),
        [classNames.popper],
    );

    const timeout = transition.timeout === undefined ? TRANSITION_DURATION : transition.timeout;

    const props = useMemo(
        () => ({ mountOnEnter: true, unmountOnExit: true, ...transition, in: open, timeout }),
        [open, transition, timeout],
    );

    const arrowClassName = useMemo(() => cn(styles.arrow, classNames.arrow), [classNames.arrow]);

    return (
        <Transition {...props}>
            {status => (
                <Portal getPortalContainer={getPortalContainer}>
                    <div
                        ref={setPopperElement}
                        className={getPopperClassName(status)}
                        style={{
                            ...popperStyles.popper,
                            transitionDuration: `${timeout}ms`,
                        }}
                        data-test-id={dataTestId}
                        {...attributes.popper}
                    >
                        {children}
                        {withArrow && (
                            <div
                                ref={setArrowElement}
                                style={popperStyles.arrow}
                                className={arrowClassName}
                            />
                        )}
                    </div>
                </Portal>
            )}
        </Transition>
    );
};
