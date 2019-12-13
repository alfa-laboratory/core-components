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

export const Content: React.FC<Props> = ({ children, className }) => (
  <section className={className}>{children}</section>
);
