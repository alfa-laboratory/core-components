import React, { memo } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import {
    VirtualOptionsList,
    OptionsListProps as OptionsListPropsLib,
} from '@alfalab/core-components-select';
import styles from './index.module.css';

export type OptionsListProps = OptionsListPropsLib & {
    onSelectAll?: () => void;
    multiple?: boolean;
};

export const OptionList = memo<OptionsListProps>(props => {
    const { onSelectAll, multiple } = props;
    return (
        <div className={styles.container}>
            <VirtualOptionsList {...props} Option={props.Option} />
            {multiple && (
                <button type='button' className={styles.chooseAll} onClick={onSelectAll}>
                    <Typography.Text view='primary-medium' color='primary'>
                        Выбрать все счета
                    </Typography.Text>
                </button>
            )}
        </div>
    );
});
