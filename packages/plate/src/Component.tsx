import React, {
    forwardRef,
    useCallback,
    useState,
    ReactNode,
    MouseEvent,
    useRef,
    ReactElement,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';
import { Button, ComponentProps as ButtonProps } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type PlateProps = {
    /**
     * Управление наличием закрывающего крестика
     */
    hasCloser?: boolean;

    /**
     * Управление наличием стрелки скрытия контента
     */
    foldable?: boolean;

    /**
     * Начальное состояние контента при foldable={ true }
     */
    defaultFolded?: boolean;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;

    /**
     * Заголовок компонента
     */
    title?: ReactNode;

    /**
     * Вид компонента
     */
    view?: 'common' | 'negative' | 'positive' | 'attention';

    /**
     * Набор действий
     */
    buttons?: Array<ReactElement<ButtonProps>>;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик клика по плашке
     */
    onClick?: (event?: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик клика по крестику
     */
    onClose?: (event?: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Plate = forwardRef<HTMLDivElement, PlateProps>(
    (
        {
            hasCloser,
            foldable = false,
            defaultFolded = true,
            leftAddons,
            children,
            buttons = [],
            title,
            view = 'common',
            className,
            onClick,
            onClose,
            dataTestId,
        },
        ref,
    ) => {
        const plateRef = useRef<HTMLDivElement>(null);
        const buttonsRef = useRef<HTMLDivElement>(null);

        const [focused] = useFocus(plateRef, 'keyboard');

        const [isHidden, setIsHidden] = useState(false);
        const [isFolded, setIsFolded] = useState(defaultFolded);

        const isFoldable = !!title && !!children && foldable;

        const hasButtons = Array.isArray(buttons) && buttons.length;
        const hasContent = children || hasButtons;

        const handleClick = useCallback(
            event => {
                const eventInsideButtons =
                    buttonsRef.current && buttonsRef.current.contains(event.target);

                const clickSimilarKeys = ['Enter', ' '].includes(event.key);

                const shouldChangeIsFolded =
                    !eventInsideButtons && (event.type === 'click' || clickSimilarKeys);

                if (isFoldable && shouldChangeIsFolded) {
                    setIsFolded(!isFolded);
                }

                if (onClick) {
                    onClick(event);
                }
            },
            [isFoldable, isFolded, onClick],
        );

        const handleClose = useCallback(
            event => {
                setIsHidden(true);

                if (onClose) {
                    onClose(event);
                }
            },
            [onClose],
        );

        const renderButtons = useCallback(
            () => (
                <div className={styles.buttons} ref={buttonsRef}>
                    {buttons.map((button, index) =>
                        button
                            ? React.cloneElement(button, {
                                  // eslint-disable-next-line react/no-array-index-key
                                  key: index,
                                  size: 'xs',
                                  view: index === 0 ? 'outlined' : 'link',
                                  className: cn(button.props.className, styles.button),
                              })
                            : null,
                    )}
                </div>
            ),
            [buttons],
        );

        return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <div
                className={cn(
                    styles.component,
                    styles[view],
                    {
                        [styles.focused]: focused,
                        [styles.isHidden]: hasCloser && isHidden,
                        [styles.isFolded]: isFoldable && isFolded,
                    },
                    className,
                )}
                onClick={handleClick}
                onKeyDown={handleClick}
                role='alert'
                ref={mergeRefs([plateRef, ref])}
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                tabIndex={isFoldable ? 0 : -1}
                data-test-id={dataTestId}
            >
                <div className={styles.inner}>
                    {leftAddons && <div className={styles.leftAddons}>{leftAddons}</div>}
                    <div
                        className={cn(styles.contentContainer, {
                            [styles.withoutTitle]: !title,
                        })}
                    >
                        {title && <div className={styles.title}>{title}</div>}
                        {hasContent && (
                            <div
                                className={cn(styles.content, {
                                    [styles.isFolded]: isFoldable && isFolded,
                                })}
                            >
                                <div className={styles.contentInner}>
                                    {children}
                                    {hasButtons ? renderButtons() : null}
                                </div>
                            </div>
                        )}
                    </div>

                    {isFoldable && (
                        <div
                            className={cn(styles.folder, {
                                [styles.isFolded]: isFolded,
                            })}
                        />
                    )}

                    {hasCloser && !isFoldable && (
                        <Button className={styles.closer} view='ghost' onClick={handleClose} />
                    )}
                </div>
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Plate.defaultProps = {
    foldable: false,
    defaultFolded: true,
    view: 'common',
};
