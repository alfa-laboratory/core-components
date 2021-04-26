import React, { Fragment } from 'react';
import { render } from '@testing-library/react';

import { Stack, stackingOrder } from '.';

const getZIndex = (element: HTMLElement) =>
    element ? parseInt(element.style.getPropertyValue('z-index'), 10) : 0;

describe('Stack', () => {
    it('should use same z-index for sibling stacks', () => {
        const testIds = ['elem-1', 'elem-2'];

        const { getByTestId } = render(
            <div>
                <Stack>
                    {zIndex => {
                        return <div style={{ zIndex }} data-test-id={testIds[0]} />;
                    }}
                </Stack>
                <Stack>
                    {zIndex => {
                        return <div style={{ zIndex }} data-test-id={testIds[1]} />;
                    }}
                </Stack>
            </div>,
        );

        const firstElementZIndex = getZIndex(getByTestId(testIds[0]));
        const secondElementZIndex = getZIndex(getByTestId(testIds[1]));

        expect(firstElementZIndex).toBe(secondElementZIndex);
    });

    it('should increment z-index for nested stack', () => {
        const testIds = ['elem-1', 'elem-2'];

        const { getByTestId } = render(
            <div>
                <Stack>
                    {zIndex => {
                        return (
                            <Fragment>
                                <div style={{ zIndex }} data-test-id={testIds[0]} />
                                <Stack>
                                    {nextZIndex => {
                                        return (
                                            <div
                                                style={{ zIndex: nextZIndex }}
                                                data-test-id={testIds[1]}
                                            />
                                        );
                                    }}
                                </Stack>
                            </Fragment>
                        );
                    }}
                </Stack>
            </div>,
        );

        const parentElementZIndex = getZIndex(getByTestId(testIds[0]));
        const childElementZIndex = getZIndex(getByTestId(testIds[1]));

        expect(childElementZIndex).toBe(parentElementZIndex + 1);
    });

    it('should use default z-index value', () => {
        const testId = 'elem-1';

        const { getByTestId } = render(
            <div>
                <Stack>
                    {zIndex => {
                        return <div style={{ zIndex }} data-test-id={testId} />;
                    }}
                </Stack>
            </div>,
        );

        const elementZIndex = getZIndex(getByTestId(testId));

        expect(elementZIndex).toBe(stackingOrder.DEFAULT);
    });

    it('should use max value', () => {
        const testId = 'elem-1';

        const { getByTestId } = render(
            <div>
                <Stack value={1}>
                    {zIndex => {
                        return <div style={{ zIndex }} data-test-id={testId} />;
                    }}
                </Stack>
            </div>,
        );

        const elementZIndex = getZIndex(getByTestId(testId));

        expect(elementZIndex).toBe(stackingOrder.DEFAULT);
    });
});
