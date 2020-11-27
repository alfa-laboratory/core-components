import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import { Checkbox } from '@alfalab/core-components-checkbox';
import { Typography } from '@alfalab/core-components-typography';
import { OptionProps as OptionPropsLib } from '@alfalab/core-components-select';
import styles from './index.module.css';

export type OptionProps = OptionPropsLib & {
    view?: 'single' | 'multiple';
};

export const Option = memo<OptionProps>(props => {
    const { innerProps, option, selected, highlighted, view = 'multiple' } = props;

    const {
        value: { balance, currency, number, openDate },
    } = option;
    const primaryColor = useMemo(() => {
        if (selected) {
            return 'primary';
        }
        return undefined;
    }, [selected]);

    return (
        <div
            {...innerProps}
            className={cn(styles.container, {
                [styles.highlighted]: highlighted,
                [styles.single]: view === 'single',
            })}
        >
            {view === 'multiple' && <Checkbox className={styles.checkmark} checked={selected} />}
            <div className={styles.main}>
                <Typography.Text view='primary-medium' color='primary'>
                    {number}
                </Typography.Text>
                <Typography.Text view='secondary-large'>
                    {balance} {currency}
                </Typography.Text>
            </div>
            <div className={styles.addon}>
                <Typography.Text view='secondary-large' color={primaryColor}>
                    Открыт
                </Typography.Text>
                <Typography.Text
                    color={primaryColor}
                    view='secondary-large'
                    className={styles.openDate}
                >
                    {openDate}
                </Typography.Text>
            </div>
        </div>
    );
});
