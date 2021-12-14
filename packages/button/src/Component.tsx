import React, {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ElementType,
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

const colorStyles = {
    default: defaultColors,
    inverted: invertedColors,
};

export type ComponentProps = {
    /**
     * Тип кнопки
     */
    view?:
        | 'primary'
        | 'secondary'
        | 'tertiary'
        | 'outlined' // deprecated
        | 'filled' // deprecated
        | 'transparent' // deprecated
        | 'link'
        | 'ghost';

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
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

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
    href?: string;

    /**
     * Позволяет использовать кастомный компонент для кнопки (например Link из роутера)
     */
    Component?: ElementType;

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
     * Набор цветов для компонента
     */
    colors?: 'default' | 'inverted';
};

type AnchorButtonProps = ComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = Partial<AnchorButtonProps | NativeButtonProps>;

/**
 * Минимальное время отображения лоадера - 500мс,
 * чтобы при быстрых ответах от сервера кнопка не «моргала».
 */
export const LOADER_MIN_DISPLAY_INTERVAL = 500;

const logWarning = (view: Required<ComponentProps>['view']) => {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    const viewsMap: { [key: string]: string } = {
        filled: 'secondary',
        transparent: 'secondary',
        outlined: 'tertiary',
    };

    // eslint-disable-next-line no-console
    console.warn(
        // eslint-disable-next-line prefer-template
        `@alfalab/core-components/button: view='${view}' будет удален в следующих мажорных версиях. ` +
            `Используйте view='${viewsMap[view]}'. Чтобы поменять все кнопки на проекте разом, можно воспользоваться codemod: ` +
            'npx core-components-codemod --transformers=button-views src/**/*.tsx',
    );
};

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
            colors = 'default',
            Component = href ? 'a' : 'button',
            ...restProps
        },
        ref,
    ) => {
        if (['outlined', 'filled', 'transparent'].includes(view)) {
            logWarning(view);
        }

        const buttonRef = useRef<HTMLElement>(null);

        const [focused] = useFocus(buttonRef, 'keyboard');

        const [loaderTimePassed, setLoaderTimePassed] = useState(true);

        const timerId = useRef(0);

        const showLoader = loading || !loaderTimePassed;

        const iconOnly = !children;

        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                styles[size],
                colorStyles[colors].component,
                colorStyles[colors][view],
                {
                    [styles.focused]: focused,
                    [styles.block]: block,
                    [styles.iconOnly]: iconOnly,
                    [styles.nowrap]: nowrap,
                    [styles.loading]: showLoader,
                    [styles.withRightAddons]: Boolean(rightAddons) && !iconOnly,
                    [styles.withLeftAddons]: Boolean(leftAddons) && !iconOnly,
                    [colorStyles[colors].loading]: showLoader,
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

            // Для совместимости с react-router-dom, меняем href на to
            const hrefProps = { [typeof Component === 'string' ? 'href' : 'to']: href };

            return (
                <Component
                    rel={target === '_blank' ? 'noreferrer noopener' : undefined}
                    {...componentProps}
                    {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
                    {...hrefProps}
                    ref={mergeRefs([buttonRef, ref])}
                >
                    {buttonChildren}
                </Component>
            );
        }

        const { disabled, type = 'button', ...restButtonProps } = restProps as ButtonHTMLAttributes<
            HTMLButtonElement
        >;

        return (
            <Component
                {...componentProps}
                {...restButtonProps}
                type={type}
                disabled={disabled || showLoader}
                ref={mergeRefs([buttonRef, ref])}
            >
                {buttonChildren}
            </Component>
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
