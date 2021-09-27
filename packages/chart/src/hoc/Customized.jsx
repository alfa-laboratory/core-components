import React from 'react';

export const CustomizedHOC = (Component, options) => {
    const NewComponent = props => {
        return <Component {...props} {...options} />;
    };

    return NewComponent;
};
