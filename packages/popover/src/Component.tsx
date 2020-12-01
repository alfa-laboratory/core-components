import React, { useState, useEffect, useCallback, CSSProperties, MutableRefObject } from 'react';
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
    anchorElement: HTMLElement;

    /**
     * Позиционирование поповера
     */
    position?: Position;

    /**
     * Если `true`, будет отрисована стрелочка
     */
    withArrow?: boolean;

    /**
     * Смещение поповера.
     * Если позиционирование top, bottom, то [x, y].
     * Если позиционирование left, right то [y, x].
     */
    offset?: [number, number];

    /**
     * Дополнительный класс для поповера
     */
    popperClassName?: string;

    /**
     * Дополнительный класс для стрелочки
     */
    arrowClassName?: string;

    /**
     * Функция, возвращающая контейнер, в который будет рендериться поповер
     */
    getPortalContainer?: () => HTMLElement;

    /**
     * Transition props, прокидываются в компонент Transition.
     * См. https://reactcommunity.org/react-transition-group/transition
     */
    transition?: Partial<TransitionProps>;

    /**
     * Рендерит компонент, обернутый в Transition
     */
    withTransition?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Хранит функцию, с помощью которой можно обновить положение компонента
     */
    update?: MutableRefObject<() => void>;
};

const TRANSITION_DURATION = 300;

export const Popover: React.FC<PopoverProps> = ({
    children,
    getPortalContainer,
    transition = {},
    anchorElement,
    offset = [0, 0],
    withArrow = false,
    withTransition = true,
    position = 'left',
    popperClassName,
    arrowClassName,
    open,
    dataTestId,
    update,
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

    const { styles: popperStyles, attributes, update: updatePopper } = usePopper(
        referenceElement,
        popperElement,
        {
            placement: position,
            modifiers: getModifiers(),
        },
    );

    useEffect(() => {
        setReferenceElement(anchorElement);
    }, [anchorElement]);

    useEffect(() => {
        if (updatePopper) {
            updatePopper();
        }
    }, [updatePopper, arrowElement, children]);

    useEffect(() => {
        if (update && updatePopper) {
            // eslint-disable-next-line no-param-reassign
            update.current = updatePopper;
        }
    }, [updatePopper, update]);

    const renderPortal = (showContent: boolean, className?: string, style?: CSSProperties) => (
        <Portal getPortalContainer={getPortalContainer}>
            {showContent && (
                <div
                    ref={setPopperElement}
                    className={cn(styles.component, className, popperClassName)}
                    style={{
                        ...popperStyles.popper,
                        ...style,
                    }}
                    data-test-id={dataTestId}
                    {...attributes.popper}
                >
                    {children}
                    {withArrow && (
                        <div
                            ref={setArrowElement}
                            style={popperStyles.arrow}
                            className={cn(styles.arrow, arrowClassName)}
                        />
                    )}
                </div>
            )}
        </Portal>
    );

    if (withTransition) {
        const timeout = transition.timeout === undefined ? TRANSITION_DURATION : transition.timeout;

        const transitionProps = {
            mountOnEnter: true,
            unmountOnExit: true,
            ...transition,
            in: open,
            timeout,
        };

        return (
            <Transition {...transitionProps}>
                {status =>
                    renderPortal(true, cn(styles[status], status), {
                        transitionDuration: `${timeout}ms`,
                    })
                }
            </Transition>
        );
    }

    return renderPortal(open);
};
