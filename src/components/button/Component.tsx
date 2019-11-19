/**
 * Vendor
 */

import React, { useState } from 'react';
import keyboardCode from '../../lib/keyboard-code';

/**
 * Components
 */

/**
 * Exp
 */

export type ViewType = 'default' | 'action' | 'extra' | 'rounded';
export type BtnType = 'button' | 'reset' | 'submit';
export type TagType = 'button' | 'span';
export type WidthType = 'default' | 'available';
export type SizeType = 's' | 'm' | 'xl' | 'l';
export type ThemeType = 'alfa-on-color' | 'alfa-on-white';
export type TogglableType = 'check' | 'radio';

export interface IButton {
  text?: JSX.Element;
  icon?: JSX.Element;
  view?: ViewType;
  type?: BtnType;
  tag?: TagType;
  width?: WidthType;
  size?: SizeType;
  disabled?: boolean;
  formNoValidate?: boolean,
  focused?: boolean;
  pseudo?: boolean;
  hovered?: boolean;
  pressed?: boolean;
  id?: string;
  title?: string;
  tabIndex?: number;
  togglable?: TogglableType;
  checked?: boolean;
  children?: JSX.Element[] | JSX.Element | string;
  'data-test-id'?: string;
  theme?: ThemeType;
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
  story?: {
    parameters: {
      info?: string
    }
  };
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

  const buttonProps = {
    role: 'button',
    id: props.id,
    type: props.type,
    title: props.title,
    tabIndex: props.disabled ? -1 : props.tabIndex,
    disabled: props.disabled,
    formNoValidate: isButton ? props.formNoValidate : false,
    hovered,
    focused: props.focused ? props.focused : focused,
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

  const buttonContent = [
    (props.children || props.text || props.icon) && (
        <span key="content">
          { props.icon && (
              <span key="icon">
                { props.icon }
              </span>
          ) }
          { (props.children || props.text) && (
              <span key="text">
                { props.children || props.text }
              </span>
          ) }
        </span>
    )
  ];

  return <button {...buttonProps}>{buttonContent}</button>;

};

Button.defaultProps = {
  type: 'button',
  tag: 'button',
  size: 'm',
  formNoValidate: false
};
