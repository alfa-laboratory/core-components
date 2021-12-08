import React, {
    useState,
    useEffect,
    useCallback,
    CSSProperties,
    MutableRefObject,
    forwardRef,
    ReactNode,
    useRef,
} from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { usePopper } from 'react-popper';
import { BasePlacement, VariationPlacement, Obj, ModifierArguments } from '@popperjs/core';
import maxSize from 'popper-max-size-modifier';
import mergeRefs from 'react-merge-refs';
import { ResizeObserver } from 'resize-observer';

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
    anchorElement: RefElement;

    /**
     * Использовать ширину родительского элемента
     */
    useAnchorWidth?: boolean;

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
     * Запрещает поповеру менять свою позицию, если он не влезает в видимую область.
     */
    preventOverflow?: boolean;

    /**
     *  Позволяет поповеру подствраивать свою высоту под границы экрана, если из-за величины контента он выходит за рамки видимой области экрана
     */
    availableHeight?: boolean;

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

    /**
     * Если поповер не помещается в переданной позиции (position), он попробует открыться в другой позиции,
     * по очереди для каждой позиции из этого списка.
     * Если не передавать, то поповер открывается в противоположном направлении от переданного position.
     */
    fallbackPlacements?: Position[];

    /**
     * Контент
     */
    children?: ReactNode;
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

const availableHieghtModifier = {
    name: 'availableHeight',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['maxSize'],
    fn({
        state: {
            modifiersData,
            elements: { popper },
        },
    }: ModifierArguments<Obj>) {
        const { height } = modifiersData.maxSize;

        const content = popper.querySelector(`.${styles.scrollableContent}`) as HTMLElement;

        if (content && !content.style.maxHeight) {
            content.style.maxHeight = `${height}px`;
        }
    },
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    (
        {
            children,
            getPortalContainer,
            transition = DEFAULT_TRANSITION,
            anchorElement,
            useAnchorWidth,
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
            fallbackPlacements,
            preventOverflow = true,
            availableHeight = false,
        },
        ref,
    ) => {
        const [referenceElement, setReferenceElement] = useState<RefElement>(anchorElement);
        const [popperElement, setPopperElement] = useState<RefElement>(null);
        const [arrowElement, setArrowElement] = useState<RefElement>(null);
        const updatePopperRef = useRef<() => void>();

        const getModifiers = useCallback(() => {
            const modifiers: PopperModifier[] = [{ name: 'offset', options: { offset } }];

            if (withArrow) {
                modifiers.push({ name: 'arrow', options: { element: arrowElement } });
            }

            if (preventFlip) {
                modifiers.push({ name: 'flip', options: { fallbackPlacements: [] } });
            }

            if (fallbackPlacements) {
                modifiers.push({ name: 'flip', options: { fallbackPlacements } });
            }

            if (preventOverflow) {
                modifiers.push({ name: 'preventOverflow', options: { mainAxis: false } });
            }

            if (availableHeight) {
                modifiers.push({ ...maxSize, options: {} });
                modifiers.push({ ...availableHieghtModifier, options: {} });
            }

            return modifiers;
        }, [
            offset,
            withArrow,
            preventFlip,
            fallbackPlacements,
            preventOverflow,
            availableHeight,
            arrowElement,
        ]);

        const { styles: popperStyles, attributes, update: updatePopper } = usePopper(
            referenceElement,
            popperElement,
            {
                placement: position,
                modifiers: getModifiers(),
            },
        );

        if (updatePopper) {
            updatePopperRef.current = updatePopper;
        }

        const updatePopoverWidth = useCallback(() => {
            if (useAnchorWidth && updatePopperRef.current) {
                updatePopperRef.current();
            }
        }, [useAnchorWidth]);

        useEffect(() => {
            setReferenceElement(anchorElement);
        }, [anchorElement]);

        useEffect(() => {
            if (updatePopper) {
                updatePopper();
            }
        }, [updatePopper, arrowElement, children]);

        useEffect(() => {
            if (update && !update.current && updatePopper) {
                // eslint-disable-next-line no-param-reassign
                update.current = updatePopper;
            }
        });

        useEffect(() => {
            if (useAnchorWidth) {
                const observer = new ResizeObserver(updatePopoverWidth);
                if (anchorElement) {
                    observer.observe(anchorElement);
                }

                return () => {
                    observer.disconnect();
                };
            }

            return () => ({});
        }, [anchorElement, updatePopoverWidth, useAnchorWidth]);

        const renderContent = (computedZIndex: number, style?: CSSProperties) => {
            return (
                <div
                    ref={mergeRefs([ref, setPopperElement])}
                    // ref={setPopperElement}
                    style={{
                        zIndex: computedZIndex,
                        width: useAnchorWidth ? referenceElement?.offsetWidth : undefined,
                        ...popperStyles.popper,
                    }}
                    data-test-id={dataTestId}
                    className={cn(styles.component, className)}
                    {...attributes.popper}
                >
                    <div className={cn(styles.inner, popperClassName)} style={style}>
                        <div className={cn(availableHeight ? styles.scrollableContent : '')}>
                            {children}
                        </div>
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
    },
);
