import React from 'react';
import { render } from '@testing-library/react';

import { FormField } from './index';

describe('FormField', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<FormField />)).toMatchSnapshot();
        });

        it('should render label', () => {
            expect(render(<FormField label={<span>This is label</span>} />)).toMatchSnapshot();
        });

        it('should render hint', () => {
            expect(render(<FormField hint='This is hint' />)).toMatchSnapshot();
        });

        it('should render error', () => {
            expect(render(<FormField error='This is error' />)).toMatchSnapshot();
        });

        it('should not render hint if has error', () => {
            const result = render(<FormField error='error' hint='hint' />);

            expect(result).toMatchSnapshot();
            expect(result.queryByText('hint')).toBeNull();
        });

        it('should render left addons', () => {
            expect(render(<FormField leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(render(<FormField rightAddons={<div>Right addons</div>} />)).toMatchSnapshot();
        });

        it('should render bottom addons', () => {
            expect(render(<FormField bottomAddons={<div>Bottom addons</div>} />)).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<FormField block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<FormField className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `labelClassName` class to label', () => {
            const className = 'test-class';
            const { container } = render(<FormField labelClassName={className} label='label' />);

            expect(container.getElementsByClassName(className)).toBeTruthy();
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<FormField size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<FormField block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `hasError` class', () => {
            const { container } = render(<FormField error='error' />);

            expect(container.firstElementChild).toHaveClass('hasError');
        });

        it('should set `filled` class', () => {
            const { container } = render(<FormField filled={true} />);

            expect(container.firstElementChild).toHaveClass('filled');
        });

        it('should set `disabled`', () => {
            const { container } = render(<FormField disabled={true} />);

            expect(container.firstElementChild).toHaveClass('disabled');
        });

        it('should set `focused`', () => {
            const { container } = render(<FormField focused={true} />);

            expect(container.firstElementChild).toHaveClass('focused');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<FormField />);

        expect(unmount).not.toThrowError();
    });
});
