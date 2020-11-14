import { useEffect, useState } from 'react';
import { getMatchMedia, releaseMatchMedia } from './utils';

/**
 * Хук для медиа запросов.
 * @param query media выражение или кастомный запрос из `mq.json`, например `--mobile`.
 */
export const useMatchMedia = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = getMatchMedia(query);

        const handleMatchChange = () => setMatches(mql.matches);

        mql.addEventListener('change', handleMatchChange);
        handleMatchChange();

        return () => {
            mql.removeEventListener('change', handleMatchChange);
            releaseMatchMedia(query);
        };
    }, [query]);

    return [matches];
};
