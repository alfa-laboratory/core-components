import { useEffect, useState, ReactElement } from 'react';
import debounce from 'lodash.debounce';

import { ResponsiveComponentProps } from './typings';

// TODO: заменить на хук из https://github.com/alfa-laboratory/utils
export function useWindowWidth(delay = 300) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleResize = debounce(() => setWidth(window.innerWidth), delay);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [delay]);

    useEffect(() => {
        setWidth(window.innerWidth);
    }, []);

    return width;
}

export const TABS_BREAK_POINT = 768;

type UseResponsiveComponentProps = {
    defaultMatch: ResponsiveComponentProps['defaultMatch'];
    desktop: ReactElement;
    mobile: ReactElement;
    breakPoint: number;
};

// TODO: вынести в какое-то общее место, чтобы переиспользовать для других компонентов
export function useResponsiveComponent({
    defaultMatch,
    breakPoint,
    desktop,
    mobile,
}: UseResponsiveComponentProps): ReactElement {
    const windowWidth = useWindowWidth();

    if (!windowWidth) {
        return defaultMatch === 'mobile' ? mobile : desktop;
    }

    return windowWidth >= breakPoint ? desktop : mobile;
}
