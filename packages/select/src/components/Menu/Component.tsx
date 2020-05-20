/* eslint-disable multiline-comment-style */
import React from 'react';
import { MenuProps } from '../../Component';

import styles from './index.module.css';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const Menu = ({ children, isOpen, items, Optgroup }: MenuProps) => {
    const counter = createCounter();

    return isOpen ? (
        <div className={styles.menu}>
            {items.map(item =>
                'items' in item
                    ? Optgroup && (
                          <Optgroup label={item.label} key={item.label}>
                              {item.items.map(groupItem => {
                                  return children({ item: groupItem, index: counter() });
                              })}
                          </Optgroup>
                      )
                    : children({ item, index: counter() }),
            )}
        </div>
    ) : null;
};
