/**
 * Vendor
 */

import { styled } from 'linaria/react';
import { IButton } from "./Component";

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
  disabled: ${(props: IButton) => props.disabled};
  pseudo: ${(props: IButton) => props.pseudo};
  view: ${(props: IButton) => props.view};
  size: ${(props: IButton) => props.size};
  width: ${(props: IButton) => props.width};
  focused: ${(props: IButton) => !props.focused ? props.focused : props.focused};
  hovered: ${(props: IButton) => props.hovered};
  pressed: ${(props: IButton) => props.pressed};
  togglable: ${(props: IButton) => props.togglable};
  checked: ${(props: IButton) => props.checked};
`;

export const StyledButtonContent = styled.span`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

export const StyledButtonIcon = styled.span`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-right: 10px;
`;

export const StyledButtonText = styled.span`
  line-height: normal;
  padding: 0 0 1px;
`;
