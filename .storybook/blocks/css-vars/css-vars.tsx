import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';

import styles from './styles.css';

type Props = {
    css: string;
    title?: string;
    keepValues?: boolean;
};

const rootBlockRegexp = /:root {([^}]*)}/g;

export const CssVars: FC<Props> = ({
    css = '',
    title = 'Список css-переменных в компоненте:',
    keepValues = false,
}) => {
    const [vars, setVars] = useState('');

    useEffect(() => {
        let rootBlockMatch = rootBlockRegexp.exec(css);

        const rootBlocks = [];

        while (rootBlockMatch) {
            rootBlocks.push(rootBlockMatch[1]);
            rootBlockMatch = rootBlockRegexp.exec(css);
        }

        const result = rootBlocks.reduce((acc, item, index) => {
            const isLast = index === rootBlocks.length - 1;

            let cssVarsList = item;

            if (!keepValues) {
                cssVarsList = cssVarsList.replace(/:[^;]+;/g, ';');
            }

            cssVarsList = cssVarsList.replace(/^ +/gm, '').replace(/^\s+/, '');

            return `${acc}${cssVarsList}${isLast ? '' : '\n'}`;
        }, '');

        setVars(result);
    }, []);

    return (
        <div>
            <h2 className={cn('sbdocs', 'sbdocs-h2')}>{title}</h2>
            <div className={styles.cssVarsList}>{vars}</div>
        </div>
    );
};
