import React from 'react';

type Props = {
    fill?: string;
};

const CircleLineIcon = ({ fill = '#FF5C5C' }: Props): React.ReactElement => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='12'
            viewBox='0 0 22 12'
            fill='none'
        >
            <circle cx='11' cy='6' r='6' fill={fill} />
            <rect y='5' width='22' height='2' fill={fill} />
        </svg>
    );
};

export default CircleLineIcon;
