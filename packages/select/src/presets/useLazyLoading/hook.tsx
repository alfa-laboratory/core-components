import React, { Reducer, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { InputProps } from '@alfalab/core-components-input';
import { Option } from '../../components/option';
import { OptionShape } from '../../typings';
import styles from './index.module.css';

const DEBOUNCE_TIMEOUT = 300;

type OptionsFetcherResponse = {
    options: OptionShape[];
    hasMore: boolean;
};

type useLazyLoadingProps = {
    /** Количество элементов на "странице" */
    limit?: number;

    /** Начальный номер "страницы" */
    initialOffset?: number;

    /** Скелетон загружаемых элементов */
    skeleton?: React.ReactNode;

    /**
     * Функция-загрузчик опций.
     * @param offset - текущая страница
     * @param limit - количество элементов на странице
     * @param queryString - строчные данные, пробрасываемые для поиска из кастомного инпута, расположенного в заголовке OptionsList
     * @returns Promise<{
     *  options - список опций следующей "страницы". Они аппендятся к предыдущим
     *  hasMore - указывает, есть ли еще незагруженные элементы (в случае false перестает загружать "следующую страницу")
     * }>
     */
    optionsFetcher<T>(
        offset: number,
        limit: number,
        queryString?: string,
    ): Promise<OptionsFetcherResponse>;
};

const actions = {
    fetchOptionsStart() {
        return { type: 'FETCH_OPTIONS_START' } as const;
    },
    fetchOptionsSuccess(payload: { options: OptionShape[]; hasMore: boolean }) {
        return { type: 'FETCH_OPTIONS_SUCCESS', payload } as const;
    },
    setIsOpened(opened: boolean) {
        return { type: 'SET_IS_OPENED', payload: opened } as const;
    },
    setQueryString(qs: string) {
        return { type: 'SET_QUERY_STRING', payload: qs } as const;
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Actions = typeof actions extends { [key: string]: (...args: any) => infer U } ? U : never;

export function useLazyLoading({
    limit = 10,
    initialOffset = 0,
    optionsFetcher,
    skeleton = <Skeleton className={styles.skeleton} visible={true} />,
}: useLazyLoadingProps) {
    const initialOptions: OptionShape[] = [];
    const initialLoading = false;

    const lazyLoadingInitialState = {
        opened: false,
        offset: initialOffset,
        options: initialOptions,
        loading: initialLoading,
        allOptionsLoaded: false,
        queryString: '',
    };

    const lazyLoadingReducer: Reducer<typeof lazyLoadingInitialState, Actions> = (
        state,
        action,
    ) => {
        switch (action.type) {
            case 'FETCH_OPTIONS_START': {
                return {
                    ...state,
                    loading: true,
                };
            }
            case 'FETCH_OPTIONS_SUCCESS': {
                return {
                    ...state,
                    options: [...state.options, ...action.payload.options],
                    offset: state.offset + 1,
                    allOptionsLoaded: !action.payload.hasMore,
                    loading: false,
                };
            }
            case 'SET_IS_OPENED': {
                return {
                    ...state,
                    opened: action.payload,
                };
            }
            case 'SET_QUERY_STRING': {
                return {
                    // Изменение queryString подразумевает сброс текущих опций.
                    ...lazyLoadingInitialState,
                    opened: state.opened,
                    loading: true,
                    queryString: action.payload,
                };
            }
        }

        return state;
    };

    const [
        { opened, offset, options, loading, allOptionsLoaded, queryString },
        dispatch,
    ] = useReducer(lazyLoadingReducer, lazyLoadingInitialState);

    const renderOption = useCallback(
        props => (
            <Option {...props} Checkmark={null} highlighted={loading ? false : props.highlighted} />
        ),
        [loading],
    );

    const skeletonOptions: OptionShape[] = useMemo(() => {
        return Array(loading ? limit : 0)
            .fill(0)
            .map((_, key) => ({
                key: `loading-${key}`,
                disabled: true,
                content: skeleton,
            }));
    }, [loading, limit, skeleton]);

    const abortFetchingOptionsRef = useRef<() => void>();

    const fetchNextOffsetOptions = useCallback(() => {
        dispatch(actions.fetchOptionsStart());

        new Promise<OptionsFetcherResponse>((resolve, reject) => {
            abortFetchingOptionsRef.current = reject;
            optionsFetcher(offset, limit, queryString).then(res => {
                resolve(res);
                abortFetchingOptionsRef.current = undefined;
            });
        })
            .then(res => {
                dispatch(actions.fetchOptionsSuccess(res));
            })
            .catch(
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {},
            );
    }, [optionsFetcher, offset, limit, queryString]);

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (opened && !loading && !allOptionsLoaded) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        observer.disconnect();
                        fetchNextOffsetOptions();
                    }
                },
                {
                    root: listRef.current,
                },
            );

            /*
             * Обсервим пересечение последней опции с контейнером.
             * Таким образом, загрузка следующей "страницы" начнется когда юзер доскроллит список
             * до верхнего края последней опции, что обеспечивает плавность
             */
            const lastOption = listRef.current?.lastElementChild;
            if (lastOption) {
                observer.observe(lastOption);
            }
        }
    }, [offset, fetchNextOffsetOptions, opened, allOptionsLoaded, initialOffset, loading]);

    const onOpen = useCallback(
        (payload: { open?: boolean }) => {
            if (payload.open) {
                if (options.length === initialOptions.length) {
                    fetchNextOffsetOptions();
                }
            }

            dispatch(actions.setIsOpened(payload.open ?? false));
        },
        [initialOptions.length, fetchNextOffsetOptions, options.length],
    );

    const fetchNextOptionsRef = useRef<() => void>();
    const fetchNextOptionsTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        fetchNextOptionsRef.current = fetchNextOffsetOptions;
    }, [fetchNextOffsetOptions]);

    const onQueryStringChange = useCallback<Exclude<InputProps['onChange'], undefined>>(
        (_, payload) => {
            dispatch(actions.setQueryString(payload.value));
            /* eslint-disable no-unused-expressions */

            /*
             * Если во время загрузки опций юзер ввел новый текст в инпут,
             * нужно прервать текущую загрузку, чтобы неактуальные опции не попали в выдачу
             */
            abortFetchingOptionsRef.current?.();

            listRef.current?.scrollTo({ top: 0 });

            /* Дебаунсим ввод текста, чтобы не отправлять запрос к новым опциям на каждый чих */
            if (fetchNextOptionsTimerRef.current) {
                clearTimeout(fetchNextOptionsTimerRef.current);
            }
            fetchNextOptionsTimerRef.current = setTimeout(() => {
                /*
                 * После дебаунса необходимо вызвать функцию-загрузчик,
                 * содержащую актуальные на данный момент данные оффсета и queryString.
                 * Поэтому мы не можем обратиться напрямую к функции fetchNextOptions,
                 * так как она будет замкнута на старые значения, актуальные на момент вызова хэндлера,
                 * так что берем ее из обновляемого рефа
                 */
                fetchNextOptionsRef.current?.();
            }, DEBOUNCE_TIMEOUT);
            /* eslint-enable */
        },
        [],
    );

    return {
        optionsProps: {
            Option: renderOption,
            options: [...options, ...skeletonOptions],
            optionsListProps: {
                ref: listRef,
                inputProps: {
                    onChange: onQueryStringChange,
                    value: queryString,
                },
            },
            onOpen,
        },
    };
}
