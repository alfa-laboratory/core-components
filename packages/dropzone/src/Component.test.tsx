import React from 'react';
import { createEvent, fireEvent, render } from '@testing-library/react';

import { Dropzone } from '.';

describe('Dropzone', () => {
    const filesList = [
        { name: 'test1.txt', type: 'application/text' },
        { name: 'test2.txt', type: 'application/text' },
        { name: 'test3.txt', type: 'application/text' },
    ];

    const dataTransfer = {
        files: {
            item: (itemIndex: number) => filesList[itemIndex],
            length: filesList.length,
        },
        items: filesList,
        clearData: jest.fn(),
    };

    const addDataTransferToEvent = (event: Event) => {
        Object.defineProperty(event, 'dataTransfer', {
            value: dataTransfer,
        });

        return event;
    };

    const fireDragEventWithFiles = (
        dropzone: Element,
        eventType: 'drop' | 'dragOver' | 'dragEnter' | 'dragLeave',
    ) => {
        const event = createEvent[eventType](dropzone);
        fireEvent(dropzone, addDataTransferToEvent(event));
    };

    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<Dropzone />);

            expect(container.firstElementChild).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const dataTestId = 'test-id';
            const { queryByTestId } = render(<Dropzone dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<Dropzone className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set/unset `dragOver` class on dragEnter', () => {
            const { container } = render(<Dropzone />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'dragEnter');

            expect(dropzone).toHaveClass('dragOver');

            fireDragEventWithFiles(dropzone, 'dragLeave');

            expect(dropzone).not.toHaveClass('dragOver');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onDrop` callback after drop file on Dropzone', () => {
            const handleDrop = jest.fn();
            const { container } = render(<Dropzone onDrop={handleDrop} />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'drop');

            expect(handleDrop).toHaveBeenCalledTimes(1);
        });

        it('should call `onDragEnter` callback after drop file on Dropzone', () => {
            const handleDragEnter = jest.fn();
            const { container } = render(<Dropzone onDragEnter={handleDragEnter} />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'dragEnter');

            expect(handleDragEnter).toHaveBeenCalledTimes(1);
        });

        it('should call `onDragLeave` callback after drop file on Dropzone', () => {
            const handleDragLeave = jest.fn();
            const { container } = render(<Dropzone onDragLeave={handleDragLeave} />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'dragLeave');

            expect(handleDragLeave).toHaveBeenCalledTimes(1);
        });

        it('should call `onDragOver` callback after drop file on Dropzone', () => {
            const handleDragOver = jest.fn();
            const { container } = render(<Dropzone onDragOver={handleDragOver} />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'dragOver');

            expect(handleDragOver).toHaveBeenCalledTimes(1);
        });

        it('onDrop should receive files list', () => {
            const handleDrop = jest.fn();
            const { container } = render(<Dropzone onDrop={handleDrop} />);

            const dropzone = container.firstElementChild as HTMLElement;

            fireDragEventWithFiles(dropzone, 'drop');

            expect(handleDrop.mock.calls[0][0]).toEqual(dataTransfer.files);
        });
    });
});
