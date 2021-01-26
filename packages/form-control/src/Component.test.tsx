import React from 'react';
import { render } from '@testing-library/react';

import { FormControl } from './index';

describe('FormControl', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<FormControl />)).toMatchSnapshot();
        });

        it('should forward ref to control wrapper', () => {
            const ref = jest.fn();
            render(<FormControl ref={ref} />);

            expect(ref.mock.calls[0][0].className).toBe('inner');
        });

        it('should render label', () => {
            expect(render(<FormControl label={<span>This is label</span>} />)).toMatchSnapshot();
        });

        it('should render hint', () => {
            expect(render(<FormControl hint='This is hint' />)).toMatchSnapshot();
        });

        it('should render error', () => {
            expect(render(<FormControl error='This is error' />)).toMatchSnapshot();
        });

        it('should not render hint if has error', () => {
            const result = render(<FormControl error='error' hint='hint' />);

            expect(result).toMatchSnapshot();
            expect(result.queryByText('hint')).toBeNull();
        });

        it('should render left addons', () => {
            expect(render(<FormControl leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(render(<FormControl rightAddons={<div>Right addons</div>} />)).toMatchSnapshot();
        });

        it('should render bottom addons', () => {
            expect(
                render(<FormControl bottomAddons={<div>Bottom addons</div>} />),
            ).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<FormControl block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <FormControl className={className} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveClass(className);
        });

        it('should set `labelClassName` class to label', () => {
            const className = 'test-class';
            const { container } = render(<FormControl labelClassName={className} label='label' />);

            expect(container.getElementsByClassName(className).length).toBe(1);
        });

        it('should set `addonsClassName` class to addons', () => {
            const className = 'test-class';
            const { container } = render(
                <FormControl
                    addonsClassName={className}
                    leftAddons={<div>Left addons</div>}
                    rightAddons={<div>Right addons</div>}
                />,
            );

            expect(container.getElementsByClassName(className).length).toBe(2);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<FormControl size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<FormControl block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `hasError` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<FormControl error='error' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).firstElementChild).toHaveClass('hasError');
        });

        it('should set `filled` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<FormControl filled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).firstElementChild).toHaveClass('filled');
        });

        it('should set `disabled`', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<FormControl disabled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).firstElementChild).toHaveClass('disabled');
        });

        it('should set `focused`', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<FormControl focused={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).firstElementChild).toHaveClass('focused');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<FormControl />);

        expect(unmount).not.toThrowError();
    });
});
