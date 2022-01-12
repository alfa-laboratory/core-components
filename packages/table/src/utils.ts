import React from 'react';

export function isChildInstanceOf<P>(child: React.ReactElement, Component: React.ComponentType<P>) {
    // мы не можем полагаться на child.type === Component, см. https://github.com/gaearon/react-hot-loader/issues/304
    return child.type === React.createElement(Component).type;
}
