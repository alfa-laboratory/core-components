/**
 * Vendor
 */

import React, { useState } from 'react';
import cn from 'classnames';

/**
 * Components
 */

import { Typography, Icon } from '../..';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

interface Props {
  title: React.ReactElement | string;
  isVisible?: boolean;
  className?: string;
}

/**
 * Exp
 */

export const Spoiler: React.FC<Props> = ({
  children,
  className,
  title,
  isVisible = false,
}) => {
  const { Title } = Typography;
  const [visible, setVisibility] = useState(isVisible);

  const _title = title ? (
    typeof title === 'string' ? (
      <Title className={styles.title} level={4}>
        {title}
      </Title>
    ) : (
      title
    )
  ) : null;

  return (
    <section className={cn(className, styles.component)}>
      <header className={styles.header}>
        {_title}
        <button
          className={styles.button}
          onClick={setVisibility.bind(null, !visible)}
        >
          <Icon name="arrowDown" size="s" />
        </button>
      </header>

      <section
        className={cn(styles.body, {
          [styles.invisible]: !visible,
        })}
      >
        {children}
      </section>
    </section>
  );
};
