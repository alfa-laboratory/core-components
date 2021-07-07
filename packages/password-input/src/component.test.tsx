import React, { useState, FC } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { PasswordInput, PasswordInputProps } from '.';

const ControlledPasswordInput: FC<PasswordInputProps> = props => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handlePasswordVisibleChange = (visible: boolean) => {
        setPasswordVisible(visible);
    };

    return (
        <PasswordInput
            {...props}
            passwordVisible={passwordVisible}
            onPasswordVisibleChange={handlePasswordVisibleChange}
        />
    );
};

const isPasswordHidden = (input: HTMLInputElement) => input.getAttribute('type') === 'password';
const isPasswordVisible = (input: HTMLInputElement) => input.getAttribute('type') === 'text';

describe('PasswordInput', () => {
    const dataTestId = 'test-id';

    describe('snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<PasswordInput />).baseElement).toMatchSnapshot();
        });
    });

    describe('interactions tests', () => {
        it('should switch password visibility (uncontrolled)', () => {
            const { baseElement, getByTestId } = render(<PasswordInput dataTestId={dataTestId} />);

            const button = baseElement.querySelector('button') as HTMLButtonElement;
            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(isPasswordHidden(input)).toBe(true);

            fireEvent.click(button);

            expect(isPasswordVisible(input)).toBe(true);

            fireEvent.click(button);

            expect(isPasswordHidden(input)).toBe(true);
        });

        it('should switch password visibility (controlled)', () => {
            const { baseElement, getByTestId } = render(
                <ControlledPasswordInput dataTestId={dataTestId} />,
            );

            const button = baseElement.querySelector('button') as HTMLButtonElement;
            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(isPasswordHidden(input)).toBe(true);

            fireEvent.click(button);

            expect(isPasswordVisible(input)).toBe(true);

            fireEvent.click(button);

            expect(isPasswordHidden(input)).toBe(true);
        });
    });
});
