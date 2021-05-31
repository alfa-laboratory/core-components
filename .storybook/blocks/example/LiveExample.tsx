import React, { FC, useState } from 'react';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';
import { ActionBar } from '@storybook/components';
import { PrismTheme } from 'prism-react-renderer';

import { ErrorSection } from './ErrorSection';
import globalScope from './utils/scope';

import styles from './index.module.css';

type LiveExampleProps = {
    code?: string;
    expanded?: boolean;
    theme?: PrismTheme;
    scope?: Record<string, unknown>;
};

export const LiveExample: FC<LiveExampleProps> = ({
    code: codeProp = '',
    expanded: expandedProp = false,
    scope = {},
    theme,
}) => {
    const [code, setCode] = useState(codeProp.trim());
    const [expanded, setExpanded] = useState(expandedProp);

    const handleChange = (value: string) => setCode(value.trim());

    const handleShare = () => {
        window.open(`/?path=/docs/гайдлайны-песочница--page/code=${encodeURIComponent(code)}`);
    };

    const actionItems = [
        {
            title: 'Поделиться',
            onClick: handleShare,
        },
        {
            title: expanded ? 'Скрыть код' : 'Показать код',
            onClick: () => setExpanded(!expanded),
        },
    ];

    return (
        <LiveProvider
            code={code}
            noInline={code.startsWith('<') === false}
            theme={theme}
            scope={{
                ...globalScope,
                ...scope,
            }}
        >
            <div className={styles.component}>
                <div className={styles.preview}>
                    <div className={styles.actionBar}>
                        <ActionBar actionItems={actionItems} />
                    </div>

                    <LivePreview />
                </div>

                {expanded && <LiveEditor className={styles.editor} onChange={handleChange} />}

                <ErrorSection className={styles.error} />
            </div>
        </LiveProvider>
    );
};
