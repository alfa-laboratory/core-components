import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';

import styles from './styles.css';

type Props = {
    css: string;
};

const cssVarDefinitionRegexp = /(--[\w\-]+):/g;

export const CssVars: FC<Props> = ({ css }) => {
    const [vars, setVars] = useState<Set<string>>(new Set());

    useEffect(() => {
        let match = cssVarDefinitionRegexp.exec(css);

        const varsArr = [];

        while (match) {
            varsArr.push(match[1]);
            match = cssVarDefinitionRegexp.exec(css);
        }

        setVars(new Set(varsArr));
    }, []);

    return (
        <div>
            <h2 className={cn('sbdocs', 'sbdocs-h2')}>Список css-переменных в компоненте:</h2>
            <ul className={styles.list}>
                {Array.from(vars).map((cssVar, index) => (
                    <li key={index} className={cn(styles.listItem, 'token', 'string')}>
                        {cssVar}
                    </li>
                ))}
            </ul>
        </div>
    );
};
