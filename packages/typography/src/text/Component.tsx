import cn from 'classnames';
import React from 'react';
import { ParagraphProps } from '../paragraph';

import styles from './index.module.css';

export const Text: React.FC<ParagraphProps> = ({
    view,
    type,
    className,
    dataTestId,
    children,
}: ParagraphProps): React.ReactElement => {
    const Component = 'span';
    const viewClass = view ? styles[view] : '';
    const typeClass = type ? styles[type] : '';

    return React.createElement(
        Component,
        {
            className: cn(styles.component, className, viewClass, typeClass),
            'data-test-id': dataTestId,
        },
        children,
    );
};

export { ParagraphProps };
