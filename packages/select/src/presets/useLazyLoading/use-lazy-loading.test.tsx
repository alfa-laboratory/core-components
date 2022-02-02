import React from 'react';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import { Skeleton } from '@alfalab/core-components-skeleton';
import { Input } from '@alfalab/core-components-input';
import { OptionsList, OptionsListProps, Select, useLazyLoading } from '../../index';

const LIMIT = 10;
const TIME_TO_FETCH = 250;
const sleep = () => new Promise(r => setTimeout(r, TIME_TO_FETCH));
const mockOptions = (offset: number) => ({
    options: Array(LIMIT)
        .fill(0)
        .map((_, i) => ({
            key: `${offset}${i}`,
            content: `Option number ${offset}${i}`,
        })),
    hasMore: offset < 2,
});

describe('Select useLazyLoading hook', () => {
    const observe = jest.fn();

    /*
     * Так как у нас нет возможности проверить настоящую работу IntersectionObserver,
     * Переопределим его поведение, доверясь браузеру, что он работает :)
     * Вместо этого, все, что мы можем сделать - это проверить, с теми ли он параметрами он
     * создался (следим за пересечением последней опции с контейнером)
     * А так же эмулируем пересечение через 100ms.
     * Таким образом мы сможем проверить правильность работы добавления опций в список.
     */
    type Entries = [{ isIntersecting: true }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = class {
        private readonly callback: (e: Entries) => void;

        private readonly options: { root: HTMLElement };

        constructor(
            callback: (e: Entries) => void,
            options: {
                root: HTMLElement;
            },
        ) {
            this.callback = callback;
            this.options = options;
        }

        observe = (targetNode: HTMLElement) => {
            observe(targetNode, this.options.root);
            setTimeout(() => {
                const entries: Entries = [{ isIntersecting: true }];
                this.callback(entries);
            }, 100);
        };

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        disconnect = () => {};
    };

    it('hook should correctly load next offset options', async () => {
        const fetchOptions = jest.fn((offset: number) => {
            return sleep().then(() => {
                return mockOptions(offset);
            });
        });

        let listRef: HTMLElement | null;

        const CustomOptionsList = React.forwardRef<HTMLElement, OptionsListProps>(
            ({ inputProps, ...props }, ref) => {
                const inputRef = React.useRef<HTMLInputElement>(null);

                return (
                    <div>
                        <div style={{ padding: '5px' }}>
                            <Input
                                label='Поиск'
                                block={true}
                                ref={inputRef}
                                dataTestId='input'
                                {...inputProps}
                            />
                        </div>
                        <OptionsList {...props} ref={ref} />
                    </div>
                );
            },
        );

        const Component: React.FC = () => {
            const { optionsProps } = useLazyLoading({
                limit: LIMIT,
                optionsFetcher: fetchOptions,
                skeleton: <Skeleton dataTestId='skeleton' visible={true} />,
            });

            listRef = optionsProps.optionsListProps.ref.current;

            return (
                <div style={{ width: 320 }}>
                    <Select dataTestId='select' {...optionsProps} OptionsList={CustomOptionsList} />
                </div>
            );
        };

        const { getByTestId, getAllByTestId, getAllByText, queryAllByTestId } = render(
            <Component />,
        );

        /*
         * Шаг 1. Открываем селект, проверяем что в списке опций всего LIMIT опций,
         * которые представляют из себя скелетоны,
         * и что вызвана функция-фетчер с параметрами
         * 0 сдвига и LIMIT итемов
         */
        await waitFor(() => {
            getByTestId('select-field').click();
        });

        await waitFor(() => {
            expect(getAllByTestId('skeleton')).toHaveLength(LIMIT);
        });

        expect(getAllByTestId('select-option')).toHaveLength(LIMIT);

        expect(fetchOptions).toHaveBeenCalledWith(0, LIMIT, '');

        // Шаг 2. Дожидаемся загрузки списка опций. Проверяем, что скелетоны заменены ими.
        await waitForElementToBeRemoved(() => getAllByTestId('skeleton'), {
            timeout: TIME_TO_FETCH * 2,
        }).then(async () => {
            const opts = getAllByText(content => content.startsWith('Option number'));
            expect(queryAllByTestId('skeleton')).toHaveLength(0);
            expect(opts).toHaveLength(LIMIT);
        });

        /*
         * Шаг 3. Убедимся, что мы следим за пересечением правильных элементов.
         */
        expect(observe).toBeCalledWith(
            getAllByTestId('select-option')[LIMIT - 1],
            getByTestId('select-options-list').firstElementChild,
        );

        /*
         * Шаг 4.
         * В моковой "реализации" intersectionObserver'a пересечение этих блоков (скролл
         * до последней опции) имитируется через 100ms после шага 3.
         * Проверим, что уже загруженные опции никуда не пропали,
         * и то, что к ним добавилось LIMIT скелетонов, индицирующие загрузку следующего офсета.
         * Также проверим, что функция-фетчер вызвалась с обновленными
         * параметрами (offset = 1, LIMIT не изменился)
         */
        await waitFor(() => {
            expect(getAllByTestId('select-option')).toHaveLength(LIMIT * 2);

            expect(getAllByTestId('skeleton')).toHaveLength(LIMIT);
            const oldOpts = getAllByText(content => content.startsWith('Option number'));
            expect(oldOpts).toHaveLength(LIMIT);

            expect(fetchOptions).toHaveBeenCalledWith(1, LIMIT, '');
        });

        /*
         * Шаг 5. После загрузки снова проверяем, пропали ли текущие скелетоны,
         * и то, что новые опции успешно добавились к старым, теперь представляя один список
         */
        await waitForElementToBeRemoved(() => getAllByTestId('skeleton'), {
            timeout: TIME_TO_FETCH * 2,
        }).then(async () => {
            expect(queryAllByTestId('skeleton')).toHaveLength(0);
        });

        await waitFor(() => {
            expect(getAllByTestId('select-option')).toHaveLength(LIMIT * 2);
            const newOpts = getAllByText(content => content.startsWith('Option number'));
            expect(newOpts).toHaveLength(LIMIT * 2);
        });

        /*
         * Шаг 6. Кратко проверим, что флоу подгрузки новых опций (шаги 3-5) отрабатывают и дальше.
         */
        await waitFor(() => {
            expect(getAllByTestId('skeleton')).toHaveLength(LIMIT);
            expect(fetchOptions).toHaveBeenCalledWith(2, LIMIT, '');
        });

        /*
         * Шаг 7. Теперь, когда уже мы уже трижды добавили опции в селект (1 раз при открытии и
         * 2 раза в результате скролла),
         * Нужно убедиться, что, если функция-фетчер вернет hasMore: false,
         * То обсервер перестанет навешиваться - тем самым флоу подгрузки новых опций прервется.
         * В моковой функции флаг hasMore вернет false, при оффсете 2 и больше
         * (этот самый момент, текущий оффсет == 2)
         */

        await waitFor(() => {
            expect(queryAllByTestId('skeleton')).toHaveLength(0);
            expect(fetchOptions).toBeCalledTimes(3);
        });

        /*
         * Шаг 8. Проверим, что изменение инпута внутри кастомного OptionsList затирает текущие
         * опции и обновляет значение офсета, а также что функция-фетчер вызывается с параметром
         * поиска по этой самой строке
         */

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        listRef.scrollTo = jest.fn();

        const input = getByTestId('input') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'Query' } });
        await waitFor(() => {
            expect(getAllByTestId('skeleton')).toHaveLength(LIMIT);
            expect(getAllByTestId('select-option')).toHaveLength(LIMIT);
            expect(fetchOptions).toHaveBeenCalledWith(0, LIMIT, 'Query');
            expect(listRef?.scrollTo).toHaveBeenCalledWith({ top: 0 });
        });
    });
});
