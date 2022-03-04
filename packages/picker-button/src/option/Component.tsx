import React, { FC, SVGProps } from 'react';
import {
    OptionProps as BaseOptionProps,
    OptionShape,
} from '@alfalab/core-components-select/src/typings';
import { Option as BaseOption } from '@alfalab/core-components-select';

import styles from './index.module.css';

type OptionProps = Omit<BaseOptionProps, 'option'> & {
    option: OptionShape & {
        icon?: FC<SVGProps<SVGSVGElement>>;
    };
};

export const Option = ({ option, children, ...restProps }: OptionProps) => {
    const content = children || option.content || option.key;

    const Icon = option.icon;

    return (
        <BaseOption option={option} {...restProps}>
            <div className={styles.container}>
                {Icon && <Icon className={styles.icon} />}
                <div className={styles.content}>{content}</div>
            </div>
        </BaseOption>
    );
};
