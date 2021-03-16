import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { FileUploadItem, FileStatuses } from './index';

export const fileProps = {
    name: 'Довольно длинное название файла.pdf',
    uploadDate: '22.01.2018',
    size: 45000,
    downloadLink: '/link',
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

        it('should call `onRestore` prop', () => {
            const cb = jest.fn();
            const fileId = 'id';
            const { getByText } = render(
                <FileUploadItem {...fileProps} downloadLink='/link' onDownload={cb} id={fileId} />,
            );

            fireEvent.click(getByText(fileProps.name));

            expect(cb).toBeCalledTimes(1);
            expect(cb.mock.calls[0][0]).toBe(fileId);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<FileUploadItem />);

        expect(unmount).not.toThrowError();
    });
});
