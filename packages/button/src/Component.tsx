import React, {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    useEffect,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';

import { useFocus } from '@alfalab/hooks';
import { Loader } from '@alfalab/core-components-loader';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

export type ComponentProps = {
    /**
     * Тип кнопки
     */
    view?: 'primary' | 'secondary' | 'outlined' | 'filled' | 'transparent' | 'link' | 'ghost';

    /**
     * Слот слева
     */
    leftAddons?: React.ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: React.ReactNode;

    /**
     * Размер компонента
     */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Выводит ссылку в виде кнопки
     */
    href?: AnchorHTMLAttributes<HTMLAnchorElement>['href'];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Показать лоадер
     */
    loading?: boolean;

    /**
     * Не переносить текст кнопки на новую строку
     */
    nowrap?: boolean;

    /**
     * Использует инвертированные цвета для компонента
     */
    inverted?: boolean;
};

type AnchorButtonProps = ComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = Partial<AnchorButtonProps | NativeButtonProps>;

/**
 * Минимальное время отображения лоадера - 500мс,
 * чтобы при быстрых ответах от сервера кнопка не «моргала».
 */
export const LOADER_MIN_DISPLAY_INTERVAL = 500;

export const Button = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            view = 'secondary',
            leftAddons,
            rightAddons,
            size = 'm',
            block = false,
            className,
            dataTestId,
            href,
            loading = false,
            nowrap = false,
            inverted = false,
            ...restProps
        },
        ref,
    ) => {
        const colorStyles = inverted ? invertedColors : defaultColors;

        const buttonRef = useRef<HTMLElement>(null);

        const [focused] = useFocus(buttonRef, 'keyboard');

        const [loaderTimePassed, setLoaderTimePassed] = useState(true);

        const timerId = useRef(0);

        const showLoader = loading || !loaderTimePassed;

        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                styles[size],
                colorStyles.component,
                colorStyles[view],
                {
                    [styles.focused]: focused,
                    [styles.block]: block,
                    [styles.iconOnly]: !children,
                    [styles.nowrap]: nowrap,
                    [styles.loading]: showLoader,
                    [colorStyles.loading]: showLoader,
                },
                className,
            ),
            'data-test-id': dataTestId || null,
        };

        const buttonChildren = (
            <React.Fragment>
                {leftAddons && <span className={styles.addons}>{leftAddons}</span>}
                {children && (
                    <span
                        className={cn(styles.text, {
                            [styles.stretchText]: !(leftAddons || rightAddons),
                        })}
                    >
                        {children}
                    </span>
                )}

                {showLoader && <Loader className={styles.loader} />}

                {rightAddons && <span className={styles.addons}>{rightAddons}</span>}
            </React.Fragment>
        );

        useEffect(() => {
            if (loading) {
                setLoaderTimePassed(false);

                timerId.current = window.setTimeout(() => {
                    setLoaderTimePassed(true);
                }, LOADER_MIN_DISPLAY_INTERVAL);
            }
        }, [loading]);

        useEffect(() => {
            return () => {
                window.clearTimeout(timerId.current);
            };
        }, []);

        if (href) {
            const { target } = restProps as AnchorHTMLAttributes<HTMLAnchorElement>;

            return (
                <a
                    rel={target === '_blank' ? 'noreferrer noopener' : undefined}
                    {...componentProps}
                    {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
                    href={href}
                    ref={mergeRefs([buttonRef, ref])}
                >
                    {buttonChildren}
                </a>
            );
        }

        const { disabled, type = 'button', ...restButtonProps } = restProps as ButtonHTMLAttributes<
            HTMLButtonElement
        >;

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                {...componentProps}
                {...restButtonProps}
                // eslint-disable-next-line react/button-has-type
                type={type}
                disabled={disabled || showLoader}
                ref={mergeRefs([buttonRef, ref])}
            >
                {buttonChildren}
            </button>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Button.defaultProps = {
    view: 'secondary',
    size: 'm',
    block: false,
    loading: false,
    nowrap: false,
};
