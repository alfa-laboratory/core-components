/**
 * Vendor
 */

import React from 'react';

/**
 * Components
 */

import { StyledButton } from './Component.style';

/**
 * Exp
 */

export const Button: React.FC<{
  onClick(): void;
}> = ({ children }) => {
  return <StyledButton>{children}</StyledButton>;
};
