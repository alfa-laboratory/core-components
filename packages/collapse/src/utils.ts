import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

/*
 * TODO: заменить на хук из https://github.com/alfa-laboratory/utils
 * TODO: стоит ли объеденить с useWindowWidth? например в useResize?
 */
export function useWindowHeight(delay = 300) {
    const isClient = typeof window === 'object';
    const [height, setHeight] = useState(isClient ? window.innerHeight : 0);

    useEffect(() => {
        if (!isClient) return;

        const handleResize = debounce(() => setHeight(window.innerHeight), delay);

        window.addEventListener('resize', handleResize);
        // eslint-disable-next-line consistent-return
        return () => window.removeEventListener('resize', handleResize);
    }, [delay, isClient]);

    return height;
}
