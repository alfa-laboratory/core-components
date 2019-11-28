/**
 * Vendor
 */

import React from 'react';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Types
 */

interface Props {
  value: string;
}

/**
 * Exp
 */

export const Amount: React.FC<Props> = ({ value }) => {
  const [head, tail] = value.split(',');
  return (
    <div className={styles.component}>
      <span className={styles.head}>
        {head}
,
      </span>
      {' '}
      {tail}
      {' '}
₽
    </div>
  );
};
