/* eslint-disable multiline-comment-style */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TabsDesktop } from './components';
import { Tab } from './components/tab';

const renderTabs = (props = { selectedId: 'tab-1' }) => {
    const renderResult = render(
        <TabsDesktop {...props}>
            <Tab title='Таб 1' id='tab-1'>
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
        </TabsDesktop>,
    );

    if (renderResult.container.firstElementChild) {
        userEvent.tab();
    }

    return renderResult;
};

describe('useTabs', () => {
    describe('Tab pressed', () => {
        it('should focus active tab element when focus moves into the tab list', () => {
            const selectedId = 'tab-2';
            const { getByRole } = renderTabs({ selectedId });
            const selected = getByRole('tab', { selected: true });

            expect(document.activeElement).toBe(selected);
        });

        it('should focus active tabpanel when the tab list contains the focus', () => {
            const { getByRole } = renderTabs();

            userEvent.tab();

            const tabpanel = getByRole('tabpanel');

            expect(document.activeElement).toBe(tabpanel);
        });
    });

    describe('Left Arrow pressed', () => {
        it('should focus prev tab', () => {
            const selectedId = 'tab-3';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft', keyCode: 37 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 2');
        });

        it('should focus last tab when first tab focused', () => {
            const selectedId = 'tab-1';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft', keyCode: 37 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 5');
        });
    });

    describe('Right Arrow pressed', () => {
        it('should focus next tab', () => {
            const selectedId = 'tab-1';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'ArrowRight', keyCode: 39 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 2');
        });

        it('should focus first tab when last tab focused', () => {
            const selectedId = 'tab-5';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'ArrowRight', keyCode: 39 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 1');
        });
    });

    describe('Home pressed', () => {
        it('should focus first tab', () => {
            const selectedId = 'tab-3';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'Home', keyCode: 36 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 1');
        });
    });

    describe('End pressed', () => {
        it('should focus last tab', () => {
            const selectedId = 'tab-3';
            renderTabs({ selectedId });

            if (document.activeElement) {
                fireEvent.keyDown(document.activeElement, { key: 'End', keyCode: 35 });
            }

            expect(document.activeElement).toHaveTextContent('Таб 5');
        });
    });
});
