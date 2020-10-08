import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Slider } from './index';

describe('Slider', () => {
    it('should match snapshot', () => {
        const { container } = render(<Slider />);
        expect(container).toMatchSnapshot();
    });

    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Slider dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    it('should forward ref to input element', () => {
        const ref = jest.fn();
        const dataTestId = 'test-id';

        render(<Slider ref={ref} dataTestId={dataTestId} />);

        expect(ref.mock.calls[0][0].tagName).toBe('INPUT');
    });

    it('should set `className` class to root', () => {
        const className = 'test-class';
        const { container } = render(<Slider className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set min, max correctly', () => {
        const dataTestId = 'test-id';
        const min = 5;
        const max = 50;
        const { getByRole } = render(<Slider min={min} max={max} dataTestId={dataTestId} />);
        const slider = getByRole('slider') as HTMLInputElement;
        const progress = getByRole('progressbar') as HTMLProgressElement;

        expect(slider.min).toBe(min.toString());
        expect(slider.max).toBe(max.toString());

        expect(progress.max).toBe(max - min);
    });

    it('should set step = 1 if (max - min) % step !== 0', () => {
        const dataTestId = 'test-id';
        const step = 3;
        const { getByRole } = render(
            <Slider min={0} max={7} step={step} dataTestId={dataTestId} />,
        );
        const slider = getByRole('slider') as HTMLInputElement;

        expect(slider.step).toBeFalsy();
    });

    it('should set value correctly', () => {
        const dataTestId = 'test-id';
        const value = 10;
        const min = 5;
        const max = 50;
        const step = 5;
        const { getByRole } = render(
            <Slider value={value} min={min} max={max} step={step} dataTestId={dataTestId} />,
        );

        expect((getByRole('slider') as HTMLInputElement).value).toBe(value.toString());
        expect((getByRole('progressbar') as HTMLProgressElement).value).toBe(value - min);
    });

    it('should set out of bounds value in range [min, max]', () => {
        const dataTestId = 'test-id';
        const min = 5;
        const max = 55;
        const valueBelowMinimum = 4;
        const valueAboveMaximum = 56;

        const { getByRole, rerender } = render(
            <Slider value={valueBelowMinimum} min={min} max={max} dataTestId={dataTestId} />,
        );

        expect((getByRole('slider') as HTMLInputElement).value).toBe(min.toString());
        expect((getByRole('progressbar') as HTMLProgressElement).value).toBe(0);

        rerender(<Slider value={valueAboveMaximum} min={min} max={max} dataTestId={dataTestId} />);

        expect((getByRole('slider') as HTMLInputElement).value).toBe(max.toString());
        expect((getByRole('progressbar') as HTMLProgressElement).value).toBe(max - min);
    });

    it('should call `onChange` prop', () => {
        const cb = jest.fn();
        const dataTestId = 'test-id';
        const value = 10;
        const { getByRole } = render(<Slider onChange={cb} dataTestId={dataTestId} />);

        const input = getByRole('slider') as HTMLInputElement;

        fireEvent.change(input, { target: { value } });

        expect(cb).toBeCalledTimes(1);
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Slider />);

        expect(unmount).not.toThrowError();
    });
});
