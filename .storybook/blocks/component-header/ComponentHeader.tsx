import React, { ReactNode } from 'react';
import { Title } from '@storybook/addon-docs/blocks';
import { Status } from 'storybook/blocks/status';

import styles from './ComponentHeader.css';

type ComponentHeaderProps = {
    name: string;
    version?: string;
    stage: number;
    status?: string;
    design?: string;
    children?: ReactNode;
};

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({
    name,
    version,
    stage,
    design,
    children,
}) => (
    <div className={styles.component}>
        <Title>{name}</Title>
        <div className={styles.version}>{version}</div>
        {stage && <Status stage={stage} />}
        {design && (
            <div className={styles.design}>
                <a href={design}>Figma</a>
            </div>
        )}
    </div>
);
