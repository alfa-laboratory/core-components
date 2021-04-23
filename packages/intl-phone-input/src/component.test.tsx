import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { IntlPhoneInput } from './index';

describe('IntlPhoneInput', () => {
    const testId = 'intl-phone-input';

    it('should match snapshot', () => {
        const { container } = render(
            <IntlPhoneInput value='+7 111 111 11 11' onChange={jest.fn()} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('should unmount without errors', () => {
        const { unmount } = render(
            <IntlPhoneInput value='+7 111 111 11 11' onChange={jest.fn()} />,
        );

        expect(unmount).not.toThrowError();
    });

    it('should call `onChange` callback after input was changed with dial code of country without priority', async () => {
        const onChange = jest.fn();
        render(<IntlPhoneInput value='+7' onChange={onChange} />);

        const input = await screen.findByDisplayValue('+7');
        fireEvent.change(input, { target: { value: '+79' } });

        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith('+7 9');
    });

    it('should call `onChange` callback after input was changed with whole russian number', async () => {
        const onChange = jest.fn();
        render(<IntlPhoneInput value='+7' onChange={onChange} />);

        const input = await screen.findByDisplayValue('+7');
        fireEvent.change(input, { target: { value: '+74957888878' } });

        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith('+7 495 788 88 78');
    });

    it('should have default country flag icon', () => {
        const { container } = render(<IntlPhoneInput value='' onChange={jest.fn()} />);

        const flagComponent = container.querySelector('.flagIcon');

        expect(flagComponent).toHaveClass('ru');
    });

    it('should have passed country flag icon', () => {
        const { container } = render(
            <IntlPhoneInput value='' onChange={jest.fn()} defaultCountryIso2='az' />,
        );

        const flagComponent = container.querySelector('.flagIcon');

        expect(flagComponent).toHaveClass('az');
    });

    it('should set new country flag icon from props', async () => {
        const { container } = render(<IntlPhoneInput value='+61' onChange={jest.fn()} />);

        await waitFor(() => expect(container.querySelector('.flagIcon')).toHaveClass('au'));
    });

    it('should call `onChange` callback after select was changed', async () => {
        const onChange = jest.fn();

        const { container, getAllByRole } = render(<IntlPhoneInput value='' onChange={onChange} />);

        const flagComponent = container.querySelector('.flagIcon');

        fireEvent.click(flagComponent as HTMLSpanElement);

        const option = getAllByRole('option')[0];

        fireEvent.click(option);

        expect(onChange).toHaveBeenCalled();
    });

    it('should focus on input after select was changed', async () => {
        const { container, getAllByRole } = render(
            <IntlPhoneInput value='+7' onChange={() => null} dataTestId={testId} />,
        );
        const input = await screen.findByDisplayValue('+7');
        const flagComponent = container.querySelector('.flagIcon');

        fireEvent.click(flagComponent as HTMLSpanElement);
        fireEvent.click(getAllByRole('option')[0]);

        expect(document.activeElement).toBe(input);
    });

    it('should call `onCountryChange` callback after country was changed', () => {
        const onCountryChange = jest.fn();
        const { container, getAllByRole } = render(
            <IntlPhoneInput
                value=''
                onChange={() => null}
                onCountryChange={onCountryChange}
                dataTestId={testId}
            />,
        );
        const flagComponent = container.querySelector('.flagIcon');

        fireEvent.click(flagComponent as HTMLSpanElement);
        fireEvent.click(getAllByRole('option')[0]);

        expect(onCountryChange).toBeCalledWith('AU');
        expect(onCountryChange).toHaveBeenCalledTimes(1);
    });

    it('should not remove country code', async () => {
        const onChange = jest.fn();
        render(<IntlPhoneInput value='+7' onChange={onChange} />);

        const input = await screen.findByDisplayValue('+7');
        fireEvent.change(input, { target: { value: '+' } });

        expect(onChange).not.toHaveBeenCalled();
        expect(input).toHaveValue('+7');
    });
});
