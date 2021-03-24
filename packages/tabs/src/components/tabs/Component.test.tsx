/* eslint-disable multiline-comment-style */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TabsDesktop } from './Component.desktop';
import { TabsMobile } from './Component.mobile';
import { TabsResponsive } from './Component.responsive';
import { Tab } from '../tab';
import { TabsProps } from '../../typings';

const tabVariants: Array<[
    typeof TabsMobile | typeof TabsDesktop | typeof TabsResponsive,
    TabsProps['view'],
]> = [
    [TabsDesktop, 'primary'],
    [TabsDesktop, 'secondary'],
    [TabsMobile, 'primary'],
    [TabsMobile, 'secondary'],
    [TabsResponsive, 'primary'],
    [TabsResponsive, 'secondary'],
];

const renderTabs = (
    Component: typeof TabsMobile | typeof TabsDesktop | typeof TabsResponsive,
    props = {},
) =>
    render(
        <Component selectedId='tab-2' {...props}>
            <Tab title='Таб 1' id='tab-1' rightAddons='addon'>
                Таб 1
            </Tab>
            <Tab title='Таб 2' id='tab-2'>
                Таб 2
            </Tab>
            <Tab title='Таб 3' id='tab-3'>
                Таб 3
            </Tab>
            <Tab title='Таб 4' id='tab-4'>
                Таб 4
            </Tab>
            <Tab title='Таб 5' id='tab-5'>
                Таб 5
            </Tab>
        </Component>,
    );

describe('Tabs', () => {
    describe('Snapshots tests', () => {
        it.each(tabVariants)('should match snapshot', (Component, view) => {
            const { container } = renderTabs(Component, { view });
            expect(container).toMatchSnapshot();
        });
    });

    describe('Classes tests', () => {
        it.each(tabVariants)('should set custom class', (Component, view) => {
            const className = 'custom-class';
            const { container } = renderTabs(Component, { view, className });

            expect(container.firstElementChild).toHaveClass(className);
        });

        it.each(tabVariants)('should set custom container class', (Component, view) => {
            const containerClassName = 'custom-container-class';
            const { container } = renderTabs(Component, { view, containerClassName });

            expect(container.querySelector('.container')).toHaveClass(containerClassName);
        });
    });

    describe('Attributes tests', () => {
        it.each(tabVariants)('should set `data-test-id` atribute', (Component, view) => {
            const dataTestId = 'test-id';
            const { getByTestId } = renderTabs(Component, { view, dataTestId });

            expect(getByTestId(dataTestId).getAttribute('role')).toBe('tablist');
        });
    });

    describe('Render tests', () => {
        it.each(tabVariants)(
            'should render only selected tabpanel by default',
            (Component, view) => {
                const { getAllByRole } = renderTabs(Component, { view });
                const tabpanels = getAllByRole('tabpanel');

                expect(tabpanels.length).toEqual(1);
            },
        );

        it.each(tabVariants)(
            'should render only one visible tabpanel if keepMounted=`true`',
            (Component, view) => {
                const { getAllByRole } = renderTabs(Component, { view, keepMounted: true });
                const hidden = getAllByRole('tabpanel', { hidden: true });
                const visible = getAllByRole('tabpanel', { hidden: false });

                expect(hidden.length).toBeGreaterThan(1);
                expect(visible.length).toEqual(1);
            },
        );

        it.each(tabVariants)('should render corresponding tabpanel', (Component, view) => {
            const { getByRole } = renderTabs(Component, { view });
            const selectedTab = getByRole('tab', { selected: true });
            const tabpanel = getByRole('tabpanel', { hidden: false });

            expect(tabpanel.textContent).toEqual(selectedTab.textContent);
        });

        it.each(tabVariants)('should unmount without errors', (Component, view) => {
            const { unmount } = renderTabs(Component, { view });

            expect(unmount).not.toThrowError();
        });

        it('should not render empty tabs', () => {
            const { queryAllByRole } = render(
                <TabsDesktop selectedId='tab-2' keepMounted={true}>
                    <Tab title='Таб 1' id='tab-1' />
                    <Tab title='Таб 2' id='tab-2' />
                    <Tab title='Таб 3' id='tab-3'>
                        Таб 3
                    </Tab>
                </TabsDesktop>,
            );

            expect(queryAllByRole('tabpanel', { hidden: true })).toHaveLength(1);
            expect(queryAllByRole('tabpanel', { hidden: false })).toHaveLength(0);
        });
    });

    describe('Interaction tests', () => {
        it.each(tabVariants)('should call `onChange`', (Component, view) => {
            const cb = jest.fn();
            const { getAllByRole } = renderTabs(Component, { view, onChange: cb });
            const tab = getAllByRole('tab', { selected: false });

            if (tab.length > 0) {
                fireEvent.click(tab[0]);
            }

            expect(cb).toBeCalledTimes(1);
        });

        it.each(tabVariants)('should not call `onChange` for selected tab', (Component, view) => {
            const cb = jest.fn();
            const { getByRole } = renderTabs(Component, { view, onChange: cb });
            const tab = getByRole('tab', { selected: true });

            if (tab) {
                fireEvent.click(tab);
            }

            expect(cb).not.toBeCalled();
        });
    });
});
