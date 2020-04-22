import React, {
    FC,
    cloneElement,
    HTMLAttributes,
    ReactElement,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import NodeResolver from 'react-node-resolver';
import cn from 'classnames';

import { Popover, Position } from '@alfalab/core-components-popover';

import styles from './index.module.css';

type Trigger = 'click' | 'hover';

type RefElement = HTMLElement | null;

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
     * События, по которому происходит открытие тултипа
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
     * Дополнительные классы
     */
    classNames?: {
        /**
         * Дополнительный класс для стрелочки
         */
        arrow?: string;

        /**
         * Дополнительный класс для контента
         */
        content?: string;
    };
};

export const Tooltip: FC<TooltipProps> = ({
    children,
    content,
    trigger = 'hover',
    onCloseDelay = 300,
    onOpenDelay = 300,
    dataTestId,
    onClose,
    onOpen,
    open: forcedOpen,
    getPortalContainer,
    classNames = {},
    offset = [0, 10],
    position,
}) => {
    const [visible, setVisible] = useState(!!forcedOpen);
    const [target, setTarget] = useState<RefElement>(null);

    const targetRef = React.useRef<RefElement>(null);
    const contentRef = React.useRef<RefElement>(null);

    let timerId = 0;

    const open = () => {
        if (!visible) {
            setVisible(true);

            if (onOpen) {
                onOpen();
            }
        }
    };

    const close = useCallback(() => {
        if (visible) {
            setVisible(false);

            if (onClose) {
                onClose();
            }
        }
    }, [onClose, visible]);

    const toggle = () => {
        if (visible) {
            close();
        } else {
            open();
        }
    };

    const clickedOutside = (node: Element): boolean => {
        if (targetRef.current && targetRef.current.contains(node)) {
            return false;
        }

        if (contentRef.current && contentRef.current.contains(node)) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        const onBodyClick = (event: MouseEvent) => {
            const eventTarget = event.target as Element;

            if (clickedOutside(eventTarget)) {
                close();
            }
        };

        document.body.addEventListener('click', onBodyClick);

        return () => {
            document.body.removeEventListener('click', onBodyClick);

            clearTimeout(timerId);
        };
    }, [close, timerId]);

    const handleTargetClick = () => {
        toggle();
    };

    const handleMouseOver = () => {
        clearTimeout(timerId);

        timerId = window.setTimeout(() => {
            open();
        }, onOpenDelay);
    };

    const handleMouseOut = () => {
        clearTimeout(timerId);

        timerId = window.setTimeout(() => {
            close();
        }, onCloseDelay);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
        const eventTarget = event.target as Element;

        clearTimeout(timerId);

        if (clickedOutside(eventTarget)) {
            timerId = window.setTimeout(() => {
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
            className: cn(styles.target),
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
            className: cn(styles.component, classNames.content),
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

    const renderTarget = () => {
        const props = getTargetProps();

        return cloneElement(children, props);
    };

    const renderContent = () => {
        const props = getContentProps();

        return <div {...props}>{content}</div>;
    };

    const show = forcedOpen === undefined ? visible : forcedOpen;

    const handleTargetRef = useCallback((ref: RefElement) => {
        targetRef.current = ref;

        setTarget(targetRef.current);
    }, []);

    return (
        <React.Fragment>
            <NodeResolver innerRef={handleTargetRef}>{renderTarget()}</NodeResolver>

            {target && (
                <Popover
                    anchorElement={target}
                    open={show}
                    getPortalContainer={getPortalContainer}
                    classNames={{
                        arrow: classNames.arrow,
                        popper: styles.popper,
                    }}
                    offset={offset}
                    withArrow={true}
                    position={position}
                >
                    {renderContent()}
                </Popover>
            )}
        </React.Fragment>
    );
};
