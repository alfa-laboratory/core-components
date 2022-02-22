import React from 'react';

export interface ResponsiveContainerProps {
    /**
     * Debounce функция при ресайзе
     */
    debounce?: number;
    children?: React.ReactNode;
}
