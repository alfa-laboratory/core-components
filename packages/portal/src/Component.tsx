import { useState, useEffect, ReactNode, forwardRef } from 'react';
import { createPortal } from 'react-dom';

import { getDefaultPortalContainer, setRef } from './utils';

export type PortalProps = {
    /** Контент */
    children?: ReactNode;

    /**
     * Функция, возвращающая контейнер, в который будут рендериться дочерние элементы
     */
    getPortalContainer?: () => Element;
};
export const Portal = forwardRef<Element, PortalProps>(
    ({ getPortalContainer = getDefaultPortalContainer, children }, ref) => {
        const [mountNode, setMountNode] = useState<Element | null>(null);

        useEffect(() => {
            setMountNode(getPortalContainer());
        }, [getPortalContainer]);

        useEffect(() => {
            if (mountNode) {
                setRef(ref, mountNode);
                return () => {
                    setRef(ref, null);
                };
            }
            return () => null;
        }, [ref, mountNode]);

        return mountNode ? createPortal(children, mountNode) : mountNode;
    },
);
