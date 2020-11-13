import MqList from './mq.json';

type AvailableMediaQueries = keyof typeof MqList;

type QueriesPool = Record<string, MediaQueryList>;

type Counters = Record<string, number>;

// TODO: перенести в alfalab/utils
const pool: QueriesPool = {};
const refCounters: Counters = {};

/**
 * Возвращает MediaQueryList для заданного media-выражения.
 *
 * @param queryProp media выражение или кастомный запрос из `mq.json`, например `--mobile`.
 */
export function getMatchMedia(queryProp: string): MediaQueryList {
    const query = MqList[queryProp as AvailableMediaQueries] || queryProp;

    if (pool[query]) {
        refCounters[query] += 1;
    } else {
        pool[query] = window.matchMedia(query);
        refCounters[query] = 1;
    }

    return pool[query];
}

/**
 * Удаляет MediaQueryList.
 *
 * @param queryProp media выражение или кастомный запрос из `mq.json`, например `--mobile`.
 */
export function releaseMatchMedia(queryProp: string): void {
    const query = MqList[queryProp as AvailableMediaQueries] || queryProp;

    refCounters[query] -= 1;

    if (pool[query] && refCounters[query] === 0) {
        delete pool[query];
        delete refCounters[query];
    }
}

/**
 * Возвращает `true`, если есть поддержка `Pointer Events`
 */
export function isPointerEventsSupported() {
    return 'PointerEvent' in window || 'msPointerEnabled' in window.navigator;
}

/**
 * Возвращает `true`, если есть поддержка `Touch Events`
 */
export function isTouchSupported() {
    return (
        'ontouchstart' in window ||
        window.navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0
    );
}
