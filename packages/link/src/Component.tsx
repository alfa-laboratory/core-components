import React, {
    AnchorHTMLAttributes,
    forwardRef,
    ReactNode,
    useRef,
    useImperativeHandle,
} from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';

import styles from './index.module.css';

type NativeProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type LinkProps = NativeProps & {
    /**
     * URL для перехода (native prop)
     */
    href?: string;

    /**
     * Тип ссылки
     */
    view?: 'primary' | 'secondary' | 'default';

    /**
     * Пунктирное подчеркивание
     */
    pseudo?: boolean;

    /**
     * Дополнительный класс (native prop)
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Обработчик нажатия (native prop)
     */
    onClick?: NativeProps['onClick'];

    /**
     * Дочерние элементы (native prop)
     */
    children: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ view = 'primary', pseudo = false, className, dataTestId, children, ...restProps }, ref) => {
        const linkRef = useRef<HTMLAnchorElement>(null);

        // Оставляет возможность прокинуть реф извне
        useImperativeHandle(ref, () => linkRef.current as HTMLAnchorElement);

        const [focused] = useFocus('keyboard', linkRef);

        const componentProps = {
            className: cn(
                styles.component,
                styles[view],
                {
                    [styles.pseudo]: pseudo,
                    [styles.focused]: focused,
                },
                className,
            ),
            'data-test-id': dataTestId,
        };

        return (
            <a {...componentProps} {...restProps} ref={linkRef}>
                {children}
            </a>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Link.defaultProps = {
    view: 'primary',
    pseudo: false,
};
