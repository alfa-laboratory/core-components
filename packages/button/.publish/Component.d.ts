/**
 * Vendor
 */
import React from 'react';
/**
 * Types TODO
 */
declare type Props = {
    type?: 'default' | 'primary' | 'secondary';
    title?: string;
    disabled?: boolean;
    htmlType?: 'button' | 'reset' | 'submit';
    icon?: React.ReactNode;
    loading?: boolean;
    size?: 'xs' | 's' | 'm' | 'l';
    block?: boolean;
    className?: string;
    dataTestId?: string;
    onClick?: (e: React.MouseEvent) => void;
};
/**
 * Expo
 */
export declare const Button: React.FC<Props>;
export {};
