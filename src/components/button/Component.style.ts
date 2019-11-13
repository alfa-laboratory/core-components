/**
 * Vendor
 */

import { styled } from 'linaria/react';

/**
 * Exp
 */

export const StyledButton = styled.button`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;

  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
  outline: 0;
  user-select: none;
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 'Roboto Rouble', sans-serif;
  text-align: center;
  white-space: nowrap;
  transition-duration: 200ms;
  transition-property: background, border-color, color, width;
  transition-timing-function: ease;
  border-radius: var(--border-radius-control);
`;
