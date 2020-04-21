import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { getDefaultPortalContainer } from './portalContainer';

export type PortalProps = {
    /**
     * Функция, возвращающая контейнер, в который будут рендериться дочерние элементы
     */
    getPortalContainer?: () => Element;
};

export const Portal: React.FC<PortalProps> = ({
    children,
    getPortalContainer = getDefaultPortalContainer,
}) => {
    const [isMount, setIsMount] = useState(false);

    useEffect(() => {
        setIsMount(true);
    }, []);

    return isMount ? createPortal(children, getPortalContainer()) : null;
};
