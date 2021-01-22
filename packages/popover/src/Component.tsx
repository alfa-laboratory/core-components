import React, { useState, useEffect, useCallback, CSSProperties, MutableRefObject } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
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
};

const TRANSITION_DURATION = 300;

export const Popover: React.FC<PopoverProps> = ({
    children,
    getPortalContainer,
    transition = { timeout: TRANSITION_DURATION },
    anchorElement,
    offset = [0, 0],
    withArrow = false,
    withTransition = true,
    position = 'left',
    preventFlip,
    popperClassName,
    arrowClassName,
    open,
    dataTestId,
    update,
    transitionDuration = `${transition.timeout}ms`,
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

    const renderContent = (style?: CSSProperties) => {
        return (
            <div
                ref={setPopperElement}
                className={cn(styles.component, popperClassName)}
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
        );
    };

    return (
        <Portal getPortalContainer={getPortalContainer}>
            {withTransition ? (
                <CSSTransition
                    unmountOnExit={true}
                    classNames={{
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                        exit: styles.exit,
                        exitActive: styles.exitActive,
                    }}
                    {...transition}
                    in={open}
                >
                    {renderContent({ transitionDuration })}
                </CSSTransition>
            ) : (
                open && renderContent()
            )}
        </Portal>
    );
};
