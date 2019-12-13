/**
 * Vendor
 */

import React from 'react';

/**
 * Types
 */

interface Props {
  className?: string;
}

/**
 * Exp
 */

export const Header: React.FC<Props> = ({ children, className }) => (
  <header className={className}>{children}</header>
);
