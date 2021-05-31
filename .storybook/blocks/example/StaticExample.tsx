import React, { FC, useState } from 'react';
import cn from 'classnames';
import { LiveEditor } from 'react-live';
import { Language, PrismTheme } from 'prism-react-renderer';
import { ActionBar } from '@storybook/components';

import { copyToClipboard } from './utils/copy-to-clipboard';

import styles from './index.module.css';

type StaticExampleProps = {
    code?: string;
    language?: Language;
    theme?: PrismTheme;
};

export const StaticExample: FC<StaticExampleProps> = ({ code = '', language = 'tsx', theme }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await copyToClipboard(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const actionItems = [
        {
            title: copied ? 'Скопировано' : 'Скопировать',
            onClick: handleCopy,
        },
    ];

    return (
        <div className={styles.component}>
            <div className={styles.actionBar}>
                <ActionBar actionItems={actionItems} />
            </div>

            <LiveEditor
                className={cn(styles.editor, styles.static)}
                value={code}
                theme={theme}
                language={language}
                disabled={true}
            />
        </div>
    );
};
