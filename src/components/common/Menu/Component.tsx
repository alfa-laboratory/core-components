/**
 * Vendor
 */

import React from 'react';
import cn from 'classnames';

/**
 * Configs
 */

import { headerLinks } from '../../../configs';

/**
 * Components
 */

import { List, Link, Badge } from '..';

/**
 * Styles
 */

import styles from './Component.module.css';

/**
 * Helpers
 */

const MenuItem: any = ({
  title, href, isActive, notifications,
}: any) => (
  <List.Item key={title} className={cn(styles.menuItem, styles.badgedTab)}>
    <Link className={styles.menuItemLink} href={href} isActive={isActive}>
      {title}
      {notifications && (
        <Badge className={styles.badge} value={20} color="red" size="l" />
      )}
    </Link>
  </List.Item>
);

/**
 * Exp
 */

export const Menu: React.FC = () => (
  <List align="horizontal" className={styles.tabs}>
    {headerLinks.map(MenuItem)}
  </List>
);
