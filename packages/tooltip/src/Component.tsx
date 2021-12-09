import React, {
    FC,
    HTMLAttributes,
    ReactElement,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useRef,
    Fragment,
    MutableRefObject,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';

import { Popover, Position, PopoverProps } from '@alfalab/core-components-popover';

import styles from './index.module.css';

type Trigger = 'click' | 'hover';

type RefElement = HTMLDivElement | null;

export type TooltipProps = {
    /**
     * Контент тултипа
     */
    content: ReactNode;

    /**
     * Позиционирование тултипа
     */
    position?: Position;

    /**
     * Задержка перед открытием тултипа
     */
    onOpenDelay?: number;

    /**
     * Задержка перед закрытием тултипа
     */
    onCloseDelay?: number;

    /**
     * Обработчик открытия тултипа
     */
    onOpen?: () => void;

    /**
     * Обработчик закрытия тултипа
     */
    onClose?: () => void;

    /**
     * Событие, по которому происходит открытие тултипа
     */
    trigger?: Trigger;

    /**
     * Если `true`, то тултип будет открыт
     */
    open?: boolean;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Дочерние элементы тултипа.
     * При срабатывании событий на них, тултип будет открываться
     */
    children: ReactElement;

    /**
     * Смещение тултипа
     */
    offset?: [number, number];

    /**
     * Функция, возвращающая контейнер, в который будет рендериться тултип
     */
    getPortalContainer?: () => HTMLElement;

    /**
     * Дополнительный класс для стрелочки
     */
    arrowClassName?: string;

    /**
     * Дополнительный класс для контента
     */
    contentClassName?: string;

    /**
     * Дополнительный класс для поповера
     */
    popoverClassName?: string;

    /**
     * Дополнительный класс для обертки над дочерними элементами
     */
    targetClassName?: string;

    /**
     * Вид тултипа
     */
    view?: 'tooltip' | 'hint';

    /**
     * Хранит функцию, с помощью которой можно обновить положение компонента
     */
    updatePopover?: PopoverProps['update'];

    /**
     * z-index компонента
     */
    zIndex?: number;

    /**
     * Реф для обертки над дочерними элементами
     */
    targetRef?: MutableRefObject<HTMLElement | null>;

    /**
     * Если тултип не помещается в переданной позиции (position), он попробует открыться в другой позиции,
     * по очереди для каждой позиции из этого списка.
     * Если не передавать, то тултип открывается в противоположном направлении от переданного position.
     */
    fallbackPlacements?: PopoverProps['fallbackPlacements'];

    /**
     * Запрещает тултипу менять свою позицию, если он не влезает в видимую область.
     */
    preventOverflow?: PopoverProps['preventOverflow'];

    /**
     *  Позволяет тултипу подствраивать свою высоту под границы экрана, если из-за величины контента он выходит за рамки видимой области экрана
     */
    availableHeight?: PopoverProps['availableHeight'];
};

export const Tooltip: FC<TooltipProps> = ({
    children,
    content,
    trigger = 'hover',
    onCloseDelay = 300,
    onOpenDelay = 300,
    dataTestId,
    open: forcedOpen,
    offset = [0, 16],
    position,
    contentClassName,
    arrowClassName,
    popoverClassName,
    updatePopover,
    targetClassName,
    zIndex,
    onClose,
    onOpen,
    getPortalContainer,
    view = 'tooltip',
    targetRef = null,
    fallbackPlacements,
    preventOverflow = true,
    availableHeight = false,
}) => {
    const [visible, setVisible] = useState(!!forcedOpen);
    const [target, setTarget] = useState<HTMLElement | null>(null);

    const contentRef = useRef<RefElement>(null);
    const timer = useRef(0);

    const show = forcedOpen === undefined ? visible : forcedOpen;

    const open = () => {
        if (!show) {
            setVisible(true);

            if (onOpen) {
                onOpen();
            }
        }
    };

    const close = useCallback(() => {
        if (show) {
            setVisible(false);

            if (onClose) {
                onClose();
            }
        }
    }, [onClose, show]);

    const toggle = () => {
        if (show) {
            close();
        } else {
            open();
        }
    };

    const clickedOutside = useCallback(
        (node: Element): boolean => {
            if (target && target.contains(node)) {
                return false;
            }

            if (contentRef.current && contentRef.current.contains(node)) {
                return false;
            }

            return true;
        },
        [target],
    );

    useEffect(() => {
        const handleBodyClick = (event: MouseEvent) => {
            const eventTarget = event.target as Element;

            if (clickedOutside(eventTarget)) {
                close();
            }
        };

        document.body.addEventListener('click', handleBodyClick);

        return () => {
            document.body.removeEventListener('click', handleBodyClick);

            clearTimeout(timer.current);
        };
    }, [clickedOutside, close]);

    const handleTargetClick = () => {
        toggle();
    };

    const handleMouseOver = () => {
        clearTimeout(timer.current);

        timer.current = window.setTimeout(() => {
            open();
        }, onOpenDelay);
    };

    const handleMouseOut = () => {
        clearTimeout(timer.current);

        timer.current = window.setTimeout(() => {
            close();
        }, onCloseDelay);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
        const eventTarget = event.target as Element;

        clearTimeout(timer.current);

        if (clickedOutside(eventTarget)) {
            timer.current = window.setTimeout(() => {
                close();
            }, onCloseDelay);
        } else {
            open();
        }
    };

    const onClickProps = { onClick: handleTargetClick };

    const onHoverProps = {
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
        onTouchStart: handleTouchStart,
    };

    const getTargetProps = (): HTMLAttributes<HTMLElement> => {
        const props = {
            className: cn(styles.target, targetClassName, {
                [styles.disabled]: children.props.disabled,
            }),
        };

        switch (trigger) {
            case 'click':
                return {
                    ...props,
                    ...onClickProps,
                };
            case 'hover':
                return {
                    ...props,
                    ...onHoverProps,
                };
            default:
                return {};
        }
    };

    const getContentProps = (): HTMLAttributes<HTMLElement> => {
        const props = {
            ref: contentRef,
            'data-test-id': dataTestId,
            className: cn(styles.component, contentClassName),
        };

        switch (trigger) {
            case 'hover':
                return {
                    ...props,
                    ...onHoverProps,
                };
            default:
                return props;
        }
    };

    return (
        <Fragment>
            <div ref={mergeRefs([targetRef, setTarget])} {...getTargetProps()}>
                <span className={cn({ [styles.disabledChild]: children.props.disabled })}>
                    {children}
                </span>
            </div>

            <Popover
                anchorElement={target}
                open={show}
                getPortalContainer={getPortalContainer}
                arrowClassName={cn(arrowClassName, styles.arrow)}
                popperClassName={cn(styles.popper, styles[view])}
                className={popoverClassName}
                offset={offset}
                withArrow={true}
                position={position}
                update={updatePopover}
                zIndex={zIndex}
                fallbackPlacements={fallbackPlacements}
                preventOverflow={preventOverflow}
                availableHeight={availableHeight}
            >
                <div {...getContentProps()}>{content}</div>
            </Popover>
        </Fragment>
    );
};
