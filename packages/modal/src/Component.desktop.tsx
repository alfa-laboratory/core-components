import React, { cloneElement, forwardRef, isValidElement, useCallback, useRef } from 'react';
import cn from 'classnames';
import { TransitionProps } from 'react-transition-group/Transition';

import { BaseModal, BaseModalProps } from '@alfalab/core-components-base-modal';
import mergeRefs from 'react-merge-refs';
import { HeaderDesktop } from './components/header/Component.desktop';
import { ContentDesktop } from './components/content/Component.desktop';
import { FooterDesktop } from './components/footer/Component.desktop';
import { Closer } from './components/closer/Component';

import styles from './desktop.module.css';
import transitions from './transitions.module.css';

export type ModalDesktopProps = BaseModalProps & {
    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l' | 'xl' | 'fullscreen';

    /**
     * Растягивает модальное окно на весь экран
     * @deprecated Используйте размер fullscreen
     */
    fullscreen?: boolean;

    /**
     * Фиксирует позицию модального окна после открытия,
     * предотвращая скачки, если контент внутри будет меняться
     */
    fixedPosition?: boolean;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

const ModalDesktopComponent = forwardRef<HTMLDivElement, ModalDesktopProps>(
    (
        {
            size = 's',
            fixedPosition,
            fullscreen,
            children,
            className,
            wrapperClassName,
            transitionProps = {},
            ...restProps
        },
        ref,
    ) => {
        // TODO: удалить, после удаления пропсы fullscreen
        const componentSize = fullscreen ? 'fullscreen' : size;

        const modalRef = useRef<HTMLElement>(null);

        const handleEntered: TransitionProps['onEntered'] = useCallback(
            (node, isAppearing) => {
                if (fixedPosition && modalRef.current) {
                    const content = modalRef.current.querySelector<HTMLElement>(
                        `.${styles.component}`,
                    );

                    if (content) {
                        const { marginTop } = window.getComputedStyle(content);
                        content.style.marginTop = marginTop;
                    }
                }

                if (transitionProps.onEntered) {
                    transitionProps.onEntered(node, isAppearing);
                }
            },
            [fixedPosition, transitionProps],
        );

        return (
            <BaseModal
                {...restProps}
                ref={mergeRefs([ref, modalRef])}
                wrapperClassName={cn(styles.wrapper, wrapperClassName, {
                    [styles.fullscreen]: componentSize === 'fullscreen',
                })}
                className={cn(styles.component, className, styles[componentSize])}
                backdropProps={{
                    ...restProps.backdropProps,
                    invisible: componentSize === 'fullscreen',
                }}
                transitionProps={{
                    classNames: transitions,
                    ...transitionProps,
                    onEntered: handleEntered,
                }}
            >
                {React.Children.map(children, child =>
                    isValidElement(child) ? cloneElement(child, { size: componentSize }) : child,
                )}
            </BaseModal>
        );
    },
);

export const ModalDesktop = Object.assign(ModalDesktopComponent, {
    Content: ContentDesktop,
    Header: HeaderDesktop,
    Footer: FooterDesktop,
    Closer,
});
