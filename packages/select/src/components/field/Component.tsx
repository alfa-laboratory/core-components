import React, { ReactNode } from 'react';
import cn from 'classnames';
import ArrowIcon from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { FieldProps } from '../../Component';

import styles from './index.module.css';

export const Field = ({
    size = 'm',
    open,
    disabled,
    filled,
    label,
    placeholder,
    value,
    leftAddons,
    showArrow = true,
    valueRenderer,
}: FieldProps) => {
    const leftAddonsRenderer = () =>
        leftAddons && <span className={styles.addons}>{leftAddons}</span>;

    return (
        <span
            className={cn(styles.component, styles[size], {
                [styles.open]: open,
                [styles.disabled]: disabled,
                [styles.filled]: filled,
                [styles.hasLabel]: label,
            })}
        >
            {leftAddonsRenderer()}

            <span className={styles.contentWrapper}>
                {placeholder && !filled && (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}

                {label && <span className={styles.label}>{label}</span>}

                {filled && (
                    <span className={styles.value}>
                        {valueRenderer
                            ? valueRenderer(value)
                            : value.reduce((acc: Array<ReactNode | string>, option, index) => {
                                  if (React.isValidElement(option.text)) {
                                      acc.push(
                                          React.cloneElement(option.text, { key: option.value }),
                                      );
                                  } else {
                                      acc.push(option.text || option.value);
                                  }

                                  if (index < value.length - 1) acc.push(', ');
                                  return acc;
                              }, [])}
                    </span>
                )}
            </span>

            {showArrow && (
                <span className={cn(styles.addons)}>
                    <ArrowIcon className={cn(styles.arrow)} />
                </span>
            )}
        </span>
    );
};
