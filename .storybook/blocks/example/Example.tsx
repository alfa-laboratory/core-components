import React, { FC } from 'react';
import { Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/oceanicNext';

import { LiveExample } from './LiveExample';
import { StaticExample } from './StaticExample';

type ExampleProps = {
    live?: boolean;
    children?: string;
    code?: string;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
};

const extractLanguageFromClassName = (classNameString = ''): Language =>
    classNameString.split(/\s+/).reduce((acc: Language, className) => {
        if (className.startsWith('language-')) {
            acc = className.replace('language-', '') as Language;
        }
        return acc;
    }, 'tsx');

export const Example: FC<ExampleProps> = ({
    children = '',
    code = children,
    live,
    className,
    language = extractLanguageFromClassName(className),
    scope,
    ...restProps
}) => {
    const exampleProps = {
        code: code.trim(),
        theme,
        ...restProps,
    };

    if (live) {
        return <LiveExample {...exampleProps} scope={scope} />;
    }

    return <StaticExample {...exampleProps} language={language} />;
};
