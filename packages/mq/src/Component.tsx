import React, { FC, Fragment, useEffect } from 'react';
import { useMedia } from './useMedia';
import { isPointerEventsSupported, isTouchSupported } from './utils';

const IS_BROWSER = typeof window !== 'undefined';
const SUPPORTS_TOUCH = IS_BROWSER && (isPointerEventsSupported() || isTouchSupported());

export type MqProps = {
    /**
     * Media выражение или кастомный запрос из `mq.json`, например `--small`.
     */
    query?: string;

    /**
     * Запрос на поддержку тач-событий
     */
    touch?: boolean;

    /**
     * Обработчик изменений в совпадении запросов
     */
    onMatchChange?: (isMatched: boolean) => void;
};

export const Mq: FC<MqProps> = ({ children, query = '', touch, onMatchChange }) => {
    const [queryMatches] = useMedia(query);

    const touchPass = touch === undefined ? true : touch === SUPPORTS_TOUCH;

    const matches = touchPass && (!query || queryMatches);

    useEffect(() => {
        if (onMatchChange) {
            onMatchChange(matches);
        }
    }, [matches, onMatchChange]);

    return <Fragment>{matches && IS_BROWSER ? children : null}</Fragment>;
};
