import React, { ReactNode } from 'react';
import { Title } from '@storybook/addon-docs/blocks';
import { Status } from 'storybook/blocks/status';
import { Design } from 'storybook/blocks/design';
import cn from 'classnames';

import styles from './ComponentHeader.css';

type ComponentHeaderProps = {
    name: string;
    version: string;
    stage?: number;
    status?: string;
    design?: string;
    children?: ReactNode;
};

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({ name, version, stage, status, design, children }) => (
    <div className={cn(styles.component)}>
        <Title>
            {name}
        </Title>
        <div className={cn(styles.version)}>
            {version}
        </div>
        <Status>
            {status}
        </Status>
        <Design>
            <a href={design}>Figma</a>
        </Design>
    </div>
);
