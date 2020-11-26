import React, { memo, useMemo } from 'react';
import { CheckChatXsBlackIcon } from '@alfalab/icons-classic';
import { OptionProps } from '@alfalab/core-components-select';
import { Typography } from '@alfalab/core-components-typography';
import styles from './index.module.css';

export const Option = memo<OptionProps>(props => {
    const { innerProps, option, selected } = props;

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
        <div className={styles.container} {...innerProps}>
            <CheckChatXsBlackIcon
                className={`${styles.checkmark} ${selected ? styles.selected : ''}`}
            />
            <div className={styles.main}>
                <Typography.Text view='primary-medium' color='primary'>
                    {balance} {currency}
                </Typography.Text>
                <Typography.Text view='secondary-large' color={primaryColor}>
                    {number}
                </Typography.Text>
            </div>
            <div className={styles.addon}>
                <Typography.Text view='secondary-large' color={primaryColor}>
                    Открыт
                </Typography.Text>
                <Typography.Text view='secondary-large' color={primaryColor}>
                    {openDate}
                </Typography.Text>
            </div>
        </div>
    );
});
