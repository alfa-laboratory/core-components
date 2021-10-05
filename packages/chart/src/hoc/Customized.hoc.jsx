import React from 'react';

function CustomizedHOC(Component, options) {
    const NewComponent = props => {
        return <Component {...props} {...options} />;
    };

    return NewComponent;
}

export default CustomizedHOC;
