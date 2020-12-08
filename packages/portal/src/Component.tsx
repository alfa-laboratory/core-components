import React, { useState, useEffect, forwardRef, ReactNode, ReactInstance } from 'react';
import { createPortal } from 'react-dom';

import { getContainer, useForkRef, setRef } from './utils';

export type PortalProps = {
    /** Контент */
    children?: ReactNode;
    /**
     * Нода, компонент или функция возвращающая их.
     *
     * Контейнер, к которому будут добавляться порталы.
     *
     * Чаще всего это `document.body`.
     */
    container?: ReactInstance | (() => ReactInstance | null) | null;
    /**
     * Отключает поведение портала.
     *
     * Дочерние элементы остаются внутри DOM.
     */
    disablePortal?: boolean;
};

/**
 * Порталы предоставляют способ визуализации дочерних элементов в узле DOM,
 * который существует вне иерархии DOM родительского компонента.
 */
export const Portal = forwardRef<Element, PortalProps>(
    ({ container = null, disablePortal, children }, ref) => {
        const [mountNode, setMountNode] = useState<Element | null>(null);

        // TODO: заменить на optional chaining
        const handleRef = useForkRef(
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            React.isValidElement(children) ? (children && children.ref) || null : null,
            ref,
        );

        useEffect(() => {
            if (!disablePortal) {
                setMountNode(getContainer(container) || document.body);
            }
        }, [container, disablePortal]);

        useEffect(() => {
            if (mountNode && !disablePortal) {
                setRef(ref, mountNode);
                return () => {
                    setRef(ref, null);
                };
            }

            return () => null;
        }, [ref, mountNode, disablePortal]);

        if (disablePortal) {
            if (React.isValidElement(children)) {
                return React.cloneElement(children, {
                    ref: handleRef,
                });
            }
            return <React.Fragment>{children}</React.Fragment>;
        }

        return mountNode ? createPortal(children, mountNode) : mountNode;
    },
);
