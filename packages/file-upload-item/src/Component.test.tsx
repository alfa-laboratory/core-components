import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { FileUploadItem, FileStatuses } from '.';

export const fileProps = {
    name: 'Довольно длинное название файла.pdf',
    uploadDate: '22.01.2018',
    size: 45000,
    downloadLink: '/link',
    download: 'новое_название_файла',
    uploadStatus: 'SUCCESS' as FileStatuses,
    showDelete: true,
};

describe('FileUploadItem', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<FileUploadItem {...fileProps} />)).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { queryByTestId } = render(<FileUploadItem dataTestId={dataTestId} />);

        expect(queryByTestId(dataTestId)).toBeInTheDocument();
    });

    it('should set `className` class', () => {
        const className = 'test-class';
        const { container } = render(<FileUploadItem className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set `className` class', () => {
        const className = 'test-class';
        const { container } = render(<FileUploadItem className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should use custom icon', () => {
        const dataTestId = 'test-id';
        const { queryByTestId } = render(
            <FileUploadItem icon={() => <div data-test-id={dataTestId} />} />,
        );

        expect(queryByTestId(dataTestId)).toBeInTheDocument();
    });

    describe('Callbacks tests', () => {
        it('should call `onDelete` prop', () => {
            const cb = jest.fn();
            const fileId = 'id';
            const { getByLabelText } = render(
                <FileUploadItem showDelete={true} onDelete={cb} id={fileId} />,
            );

            fireEvent.click(getByLabelText('удалить'));

            expect(cb).toBeCalledTimes(1);
            expect(cb.mock.calls[0][0]).toBe(fileId);
        });

        it('should call `onRestore` prop', () => {
            const cb = jest.fn();
            const fileId = 'id';
            const { getByText } = render(
                <FileUploadItem showRestore={true} onRestore={cb} id={fileId} />,
            );

            fireEvent.click(getByText('Восстановить'));

            expect(cb).toBeCalledTimes(1);
            expect(cb.mock.calls[0][0]).toBe(fileId);
        });

        it('should call `onDownload` prop', async () => {
            const cb = jest.fn();
            const fileId = 'id';
            const { baseElement } = render(
                <FileUploadItem {...fileProps} downloadLink='/link' onDownload={cb} id={fileId} />,
            );

            const downloadButton = baseElement.querySelector('a') as HTMLAnchorElement;

            fireEvent.click(downloadButton);

            expect(cb).toBeCalledTimes(1);
            expect(cb.mock.calls[0][0]).toBe(fileId);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<FileUploadItem />);

        expect(unmount).not.toThrowError();
    });
});
