/**
 * Vendor
 */

import React from 'react';
import cn from 'classnames';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types TODO
 */

type Props = {
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

export const Button: React.FC<Props> = function Button({
  children,
  type = 'default',
  title = '',
  disabled = false,
  htmlType = 'button',
  icon,
  loading = false,
  size = 'xs',
  block = false,
  className = '',
  dataTestId,

  onClick,
}) {
  return (
    <button
      type={htmlType}
      title={title}
      disabled={disabled}
      className={cn(styles.component, styles[type], styles[size], {
        [styles.block]: block,
      }, className)}
      onClick={onClick}
      data-test-id={dataTestId}
    >
      {icon && icon}
      {children}
    </button>
  );
};
