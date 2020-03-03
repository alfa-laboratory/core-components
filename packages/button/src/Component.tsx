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
 * Types
 */

type Props = {
  type?: 'primary' | 'secondary' | 'outlined' | 'link' | 'ghost';
  title?: string;
  disabled?: boolean;
  htmlType?: 'button' | 'reset' | 'submit';
  href?: string;
  icon?: React.ReactNode;
  rightIcon?: boolean;
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

export const Button: React.FC<Props> = ({
  children,
  type = 'secondary',
  title,
  disabled = false,
  htmlType = 'button',
  href,
  icon,
  rightIcon = false,
  // loading = false,
  size = 'm',
  block = false,
  className = '',
  dataTestId,

  onClick,
}) => {
  const buttonProps = {
    title,
    className: cn(
      styles.component,
      styles[type],
      styles[size],
      {
        [styles.block]: block,
        [styles['icon-only']]: !children,
      },
      className
    ),
    onClick,
    'data-test-id': dataTestId || null,
  };

  const buttonChildren = (
    <>
      {!rightIcon && icon && <span className={cn(styles.icon)}>{icon}</span>}
      {children && <span className={cn(styles.text)}>{children}</span>}
      {rightIcon && icon && <span className={cn(styles.icon)}>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a {...buttonProps} href={href}>
        {buttonChildren}
      </a>
    );
  }

  return (
    <button {...buttonProps} type={htmlType} disabled={disabled}>
      {buttonChildren}
    </button>
  );
};
