import React, { forwardRef, useCallback, useState } from 'react';
import { Input, InputProps } from '@alfalab/core-components-input';
import { IconButton } from '@alfalab/core-components-icon-button';
import EyeMIcon from '@alfalab/icons-glyph/EyeMIcon';
import EyeOffMIcon from '@alfalab/icons-glyph/EyeOffMIcon';

import styles from './index.module.css';

export type PasswordInputProps = InputProps & {
    /**
     * Управление видимостью пароля (controlled)
     */
    passwordVisible?: boolean;

    /**
     * Коллбэк при изменении видимости пароля
     */
    onPasswordVisibleChange?: (visible: boolean) => void;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ onPasswordVisibleChange, passwordVisible, disabled, ...restProps }, ref) => {
        const uncontrolled = passwordVisible === undefined;

        const [statePasswordVisible, setStatePasswordVisible] = useState(
            uncontrolled ? false : passwordVisible,
        );

        const handleButtonClick = useCallback(() => {
            if (onPasswordVisibleChange) {
                onPasswordVisibleChange(!passwordVisible);
            }

            if (uncontrolled) {
                setStatePasswordVisible(visible => !visible);
            }
        }, [passwordVisible, uncontrolled, onPasswordVisibleChange]);

        const isPasswordVisible = uncontrolled ? statePasswordVisible : passwordVisible;

        return (
            <Input
                {...restProps}
                disabled={disabled}
                type={isPasswordVisible ? 'text' : 'password'}
                ref={ref}
                rightAddons={
                    <IconButton
                        view='secondary'
                        size='s'
                        icon={isPasswordVisible ? EyeMIcon : EyeOffMIcon}
                        onClick={handleButtonClick}
                        disabled={disabled}
                    />
                }
                addonsClassName={styles.addons}
                inputClassName={styles.input}
            />
        );
    },
);
