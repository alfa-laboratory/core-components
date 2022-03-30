import React, { ReactNode, useState } from 'react';
import cn from 'classnames';
import { TRow, TRowProps } from '../trow';

import styles from './index.module.css';

export type TExpandableRowProps = TRowProps & {
    defaultExpanded?: boolean;

    expanded?: boolean;

    onToggle?: (expanded: boolean) => void;

    renderContent: (expanded: boolean) => ReactNode;
};

export const TExpandableRow = ({
    className,
    selected,
    expanded,
    defaultExpanded = false,
    onToggle = () => null,
    renderContent = () => null,
    ...restProps
}: TExpandableRowProps) => {
    const [expandedState, setExpandedState] = useState<boolean>(defaultExpanded);

    const uncontrolled = expanded === undefined;

    const isExpanded = (uncontrolled ? expandedState : expanded) as boolean;

    const handleToggle = () => {
        if (uncontrolled) {
            setExpandedState(!isExpanded);
        }

        onToggle(isExpanded);
    };

    return (
        <React.Fragment>
            <TRow
                className={cn(styles.row, className, {
                    [styles.selected]: selected,
                    [styles.expanded]: isExpanded,
                })}
                selected={selected}
                onClick={handleToggle}
                {...restProps}
            />

            <tr className={cn(styles.expandable, { [styles.expanded]: isExpanded })}>
                {renderContent(isExpanded)}
            </tr>
        </React.Fragment>
    );
};
