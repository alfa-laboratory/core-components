import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

const DEFAULT_BUTTON_COLOR = '#FF45C3';
const DEFAULT_CONTENT_COLOR = 'white';

export type ComponentProps = {
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
     * Цвет кнопки
     */
    backgroundColor?: string;

    /**
     * Цвет контента
     */
    contentColor?: 'black' | 'white';
};

type AnchorButtonProps = ComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type CustomButtonProps = Partial<AnchorButtonProps | NativeButtonProps>;

export const CustomButton = React.forwardRef<
    HTMLAnchorElement | HTMLButtonElement,
    CustomButtonProps
>(
    (
        {
            children,
            className,
            loading,
            backgroundColor = DEFAULT_BUTTON_COLOR,
            contentColor = DEFAULT_CONTENT_COLOR,
            ...restProps
        },
        ref,
    ) => {
        const buttonProps = {
            style: { background: backgroundColor },
            ...restProps,
        };

        const buttonClassName = cn(styles.customButton, className, styles[contentColor], {
            [styles.customLoading]: loading,
        });

        return (
            <Button
                {...buttonProps}
                view='primary'
                ref={ref}
                className={buttonClassName}
                loading={loading}
            >
                {children}
            </Button>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
CustomButton.defaultProps = {
    size: 'm',
    block: false,
    loading: false,
    nowrap: false,
};
