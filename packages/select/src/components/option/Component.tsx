import React, { FC, isValidElement } from 'react';
import cn from 'classnames';
import { Checkmark as DefaultCheckMark } from '../checkmark';
import { OptionProps } from '../../typings';

import styles from './index.module.css';

export const Option: FC<OptionProps> = ({
    size = 's',
    className,
    option,
    children,
    selected,
    highlighted,
    disabled,
    multiple,
    Checkmark = DefaultCheckMark,
    innerProps,
    dataTestId,
    leftCheckmarkHidden
}) => {
    const content = children || option.content || option.key;

    return (
        <div
            {...innerProps}
            className={cn(styles.option, styles[size], className, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
                [styles.disabled]: disabled,
            })}
            data-test-id={dataTestId}
        >
            {Checkmark && !leftCheckmarkHidden && <Checkmark selected={selected} multiple={multiple} position='before' />}

            <div
                className={cn(styles.content, {
                    [styles.textContent]: !isValidElement(content),
                })}
            >
                {content}
            </div>

            {/** Workaround чтобы для клика показывать отметку справа и всегда в виде иконки */}
            {Checkmark && <Checkmark selected={selected} multiple={multiple} position='after' />}
        </div>
    );
};
