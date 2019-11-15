/**
 * Vendor
 */

import React, { useState } from 'react';
import keyboardCode from '../../lib/keyboard-code';

/**
 * Components
 */

import { StyledButton, StyledButtonContent, StyledButtonIcon, StyledButtonText } from './Component.style';

/**
 * Exp
 */

export interface IButton {
  text?: JSX.Element;
  icon?: JSX.Element;
  view?: 'default' | 'action' | 'extra' | 'rounded';
  type?: 'button' | 'reset' | 'submit';
  tag?: 'button' | 'span';
  width?: 'default' | 'available';
  size?: 's' | 'm' | 'xl' | 'l';
  disabled?: boolean;
  focused?: boolean;
  pseudo?: boolean;
  hovered?: boolean;
  pressed?: boolean;
  id?: string;
  formNoValidate?: boolean;
  title?: string;
  tabIndex?: number;
  togglable?: 'check' | 'radio';
  checked?: boolean;
  children?: JSX.Element[] | JSX.Element;
  'data-test-id'?: string;
  theme?: 'alfa-on-color' | 'alfa-on-white';
  className?: string;
  onClick?: (event: React.SyntheticEvent) => void;
  onFocus?: (event: React.SyntheticEvent) => void;
  onBlur?: (event: React.SyntheticEvent) => void;
  onMouseEnter?: (event: React.SyntheticEvent) => void;
  onMouseLeave?: (event: React.SyntheticEvent) => void;
  onMouseDown?: (event: React.SyntheticEvent) => void;
  onMouseUp?: (event: React.SyntheticEvent) => void;
  onMouseOut?: (event: React.SyntheticEvent) => void;
  onKeyUp?: (event: React.SyntheticEvent) => void;
  onKeyDown?: (event: React.SyntheticEvent) => void;
}

export const Button: React.FC<IButton> = (props) => {
  const isButton = props.tag !== 'span';
  const [focused, setFocus] = useState(false);
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = (event: React.SyntheticEvent) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  const handleFocus = (event: React.SyntheticEvent) => {
    console.log('Ало', pressed);
    if (pressed) return;

    setFocus(true);

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const handleBlur = (event: React.SyntheticEvent) => {
    setFocus(false);

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const handleMouseEnter = (event: React.SyntheticEvent) => {
    if (!props.disabled) {
      setHover(true);
    }

    if (props.onMouseEnter) {
      props.onMouseEnter(event);
    }
  };

  const handleMouseLeave = (event: React.SyntheticEvent) => {
    if (!props.disabled) {
      setHover(false);
    }

    if (props.onMouseLeave) {
      props.onMouseLeave(event);
    }
  };

  const handleMouseDown = (event: React.SyntheticEvent) => {
    if (props.disabled) {
      setPressed(true);
    }

    if (props.onMouseDown) {
      props.onMouseDown(event);
    }
  };

  const handleMouseUp = (event: React.SyntheticEvent) => {
    if (props.disabled) {
      setPressed(false);
    }

    if (props.onMouseUp) {
      props.onMouseUp(event);
    }
  };

  const handleMouseOut = (event: React.SyntheticEvent) => {
    if (!props.disabled) {
      setPressed(true);
    }

    if (props.onMouseOut) {
      props.onMouseOut(event);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if ((event.which === keyboardCode.ENTER || event.which === keyboardCode.SPACE) && !props.disabled) {
      setPressed(false);
    }

    if (props.onKeyUp) {
      props.onKeyUp(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.which === keyboardCode.ENTER || event.which === keyboardCode.SPACE) && !props.disabled) {
      setPressed(true);
    }

    if (props.onKeyDown) {
      props.onKeyDown(event);
    }
  };

  let buttonProps = {
    role: 'button',
    id: props.id,
    type: props.type,
    title: props.title,
    tabIndex: props.disabled ? '-1' : props.tabIndex,
    disabled: props.disabled,
    formNoValidate: isButton ? props.formNoValidate : null,
    hovered,
    focused,
    pressed,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseOut: handleMouseOut,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    'data-test-id': props['data-test-id']
  };

  let buttonContent = [
    (props.children || props.text || props.icon) && (
        <StyledButtonContent key="content">
          { props.icon && (
              <StyledButtonIcon key="icon">
                { props.icon }
              </StyledButtonIcon>
          ) }
          { (props.children || props.text) && (
              <StyledButtonText key="text">
                { props.children || props.text }
              </StyledButtonText>
          ) }
        </StyledButtonContent>
    )
  ];

  return <StyledButton {...buttonProps}>{buttonContent}</StyledButton>;

};

Button.defaultProps = {
  type: 'button',
  tag: 'button',
  size: 'm',
  formNoValidate: false
};
