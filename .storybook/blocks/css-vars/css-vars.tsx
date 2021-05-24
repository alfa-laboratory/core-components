import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import Highlight from 'react-highlight.js';

import 'highlight.js/styles/vs.css';

import styles from './styles.css';

type Props = {
    css: string;
    title?: string;
};

const rootBlockRegexp = /:root {([^}]*)}/g;

export const CssVars: FC<Props> = ({ css, title }) => {
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
            const divider = isLast ? '' : '\n';

            return `:root {${acc}${item}${divider}}`;
        }, '');

        setVars(result);
    }, []);

    return (
        <div>
            {title && <h2 className={cn('sbdocs', 'sbdocs-h2')}>{title}</h2>}

            <div className={styles.cssVarsList}>
                <Highlight language='css'>{vars}</Highlight>
            </div>
        </div>
    );
};
