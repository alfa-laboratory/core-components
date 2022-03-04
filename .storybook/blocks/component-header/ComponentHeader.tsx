import React, { ReactNode } from 'react';
import cn from 'classnames';
import { Title } from '@storybook/addon-docs';
import { Status } from 'storybook/blocks/status';

import styles from './ComponentHeader.module.css';

type ComponentHeaderProps = {
    name: string;
    version?: string;
    npmPackage?: string;
    stage: number;
    status?: string;
    design?: string;
    children?: ReactNode;
};

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({
    name,
    version,
    npmPackage,
    stage,
    design,
    children,
}) => {
    const packageName = name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
        .toLowerCase();
    const githubLink = `https://github.com/alfa-laboratory/core-components/tree/master/packages/${packageName}`;

    return (
        <div className={styles.component}>
            <Title>{name}</Title>
            <div className={styles.version}>{version}</div>
            {stage && <Status stage={stage} />}
            <div className={styles.links}>
                <div className={styles.github}>
                    <a href={githubLink} target='_blank'>
                        Github
                    </a>
                </div>
                <div
                    className={styles.design}
                    className={cn(
                        styles.design,
                        {
                            [styles.commonLink]: !design,
                        },
                    )}
                >
                    <a href={design || 'https://www.figma.com/file/JnpPl4gvg2Zjr7zvTz8mUk/Web-%3A%3A-Core-Default-Components'} target='_blank'>
                        Figma
                    </a>
                </div>
            </div>
        </div>
    );
};
