import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

// TODO: заменить на хук из https://github.com/alfa-laboratory/utils
export function useWindowWidth(delay = 300) {
    const isClient = typeof window === 'object';
    const [width, setWidth] = useState(isClient ? window.innerWidth : 0);

    useEffect(() => {
        if (!isClient) return;

        const handleResize = debounce(() => setWidth(window.innerWidth), delay);

        window.addEventListener('resize', handleResize);
        // eslint-disable-next-line consistent-return
        return () => window.removeEventListener('resize', handleResize);
    }, [delay, isClient]);

    return width;
}
