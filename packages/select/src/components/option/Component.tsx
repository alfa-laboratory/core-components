import React, { FC, isValidElement, SVGProps } from 'react';
import cn from 'classnames';
import { Checkmark as DefaultCheckMark } from '../checkmark';
import { OptionProps, OptionShape } from '../../typings';

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
}) => {
    const Icon: FC<SVGProps<SVGSVGElement>> | undefined = (option as OptionShape & {
        icon?: FC<SVGProps<SVGSVGElement>> 
    }).icon;
    
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
            {Checkmark && <Checkmark selected={selected} multiple={multiple} position='before' />}

            <div
                className={cn(styles.content, {
                    [styles.textContent]: !isValidElement(content),
                })}
            >
                {Icon && (
                    <span className={cn(styles.iconContainer)}>
                        <Icon />
                    </span>
                )}
                {content}
            </div>

            {/** Workaround чтобы для клика показывать отметку справа и всегда в виде иконки */}
            {Checkmark && <Checkmark selected={selected} multiple={multiple} position='after' />}
        </div>
    );
};
