import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';

import styles from './styles.css';

type Props = {
    css: string;
};

const rootBlockRegexp = /:root {([^}]*)}/g;

export const CssVars: FC<Props> = ({ css }) => {
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

            const cssVarsList = item
                .replace(/:[^;]+;/g, ';')
                .replace(/^ +/gm, '')
                .replace(/^\s+/, '');

            return `${acc}${cssVarsList}${isLast ? '' : '\n'}`;
        }, '');

        setVars(result);
    }, []);

    return (
        <div>
            <h2 className={cn('sbdocs', 'sbdocs-h2')}>Список css-переменных в компоненте:</h2>
            <div className={styles.cssVarsList}>{vars}</div>
        </div>
    );
};
