import React, { useState, useEffect, useCallback, CSSProperties, MutableRefObject } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { usePopper } from 'react-popper';
import { BasePlacement, VariationPlacement, Obj } from '@popperjs/core';

import { Stack, stackingOrder } from '@alfalab/core-components-stack';
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
     * Запрещает поповеру менять свою позицию.
     * Например, если места снизу недостаточно,то он все равно будет показан снизу
     */
    preventFlip?: boolean;

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
     * CSSTransitionProps, прокидываются в компонент CSSTransitionProps.
     */
    transition?: CSSTransitionProps;

    /**
     * Выставляет кастомное свойство transition-duration
     */
    transitionDuration?: CSSProperties['transitionDuration'];

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

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * z-index компонента
     */
    zIndex?: number;
};

const DEFAULT_TRANSITION = {
    timeout: 150,
};

const CSS_TRANSITION_CLASS_NAMES = {
    enter: styles.enter,
    enterActive: styles.enterActive,
    exit: styles.exit,
    exitActive: styles.exitActive,
};

export const Popover: React.FC<PopoverProps> = ({
    children,
    getPortalContainer,
    transition = DEFAULT_TRANSITION,
    anchorElement,
    offset = [0, 0],
    withArrow = false,
    withTransition = true,
    position = 'left',
    preventFlip,
    popperClassName,
    arrowClassName,
    className,
    open,
    dataTestId,
    update,
    transitionDuration = `${transition.timeout}ms`,
    zIndex = stackingOrder.POPOVER,
}) => {
    const [referenceElement, setReferenceElement] = useState<RefElement>(anchorElement);
    const [popperElement, setPopperElement] = useState<RefElement>(null);
    const [arrowElement, setArrowElement] = useState<RefElement>(null);

    const getModifiers = useCallback(() => {
        const modifiers: PopperModifier[] = [{ name: 'offset', options: { offset } }];

        if (withArrow) {
            modifiers.push({ name: 'arrow', options: { element: arrowElement } });
        }

        if (preventFlip) {
            modifiers.push({ name: 'flip', options: { fallbackPlacements: [] } });
        }

        return modifiers;
    }, [offset, withArrow, preventFlip, arrowElement]);

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

    const renderContent = (computedZIndex: number, style?: CSSProperties) => {
        return (
            <div
                ref={setPopperElement}
                style={{
                    zIndex: computedZIndex,
                    ...popperStyles.popper,
                }}
                data-test-id={dataTestId}
                className={cn(styles.component, className)}
                {...attributes.popper}
            >
                <div className={cn(styles.inner, popperClassName)} style={style}>
                    {children}
                    {withArrow && (
                        <div
                            ref={setArrowElement}
                            style={popperStyles.arrow}
                            className={cn(styles.arrow, arrowClassName)}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <Stack value={zIndex}>
            {computedZIndex => (
                <Portal getPortalContainer={getPortalContainer}>
                    {withTransition ? (
                        <CSSTransition
                            unmountOnExit={true}
                            classNames={CSS_TRANSITION_CLASS_NAMES}
                            {...transition}
                            in={open}
                        >
                            {renderContent(computedZIndex, { transitionDuration })}
                        </CSSTransition>
                    ) : (
                        open && renderContent(computedZIndex)
                    )}
                </Portal>
            )}
        </Stack>
    );
};
