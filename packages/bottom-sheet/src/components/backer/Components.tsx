import React, { ButtonHTMLAttributes, ElementType, useCallback, useContext } from 'react';
import cn from 'classnames';
import { IconButton, IconButtonProps } from "@alfalab/core-components-icon-button";
import { ArrowBackMIcon } from '@alfalab/icons-glyph/ArrowBackMIcon';
import { BaseModalContext } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

export type BackerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Дополнительный класс
   */
  className?: string;

  /**
   * Размер кнопки
   */
  size?: IconButtonProps['size'];

  /**
   * Иконка
   */
  icon?: ElementType;

  /**
   * Обработчик нажатия
   */
  onClick?: () => void;
};

export const Backer: React.FC<BackerProps> = ({
  className,
  size = 'xs',
  icon = ArrowBackMIcon,
  onClick,
  ...restProps
}) => {
  return (
    <div className={cn(styles.backer, className)}>
      <IconButton
        size={size}
        className={styles.button}
        aria-label='назад'
        onClick={onClick}
        icon={icon}
        {...restProps}
      />
    </div>
  );
}
