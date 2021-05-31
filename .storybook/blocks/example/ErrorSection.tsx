import React, { FC, useContext } from 'react';
import { LiveContext } from 'react-live';

type ErrorSectionProps = {
    className?: string;
};

export const ErrorSection: FC<ErrorSectionProps> = ({ className }) => {
    const context = useContext(LiveContext);

    let error = context.error;

    if (error === 'SyntaxError: No-Inline evaluations must call `render`.') {
        error = `SyntaxError: Оберните компонент в функцию render:\nrender(\n\t<Component />\n)`;
    }

    return error ? <pre className={className}>{error}</pre> : null;
};
