import React from 'react';

type Props = {
    fill?: string;
    height?: number;
};

export const CircleLineIcon = ({ fill = '#FF5C5C', height = 16 }: Props): React.ReactElement => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' height={height} viewBox='0 0 22 12' fill='none'>
            <circle cx='11' cy='6' r='6' fill={fill} />
            <rect y='5' width='22' height='2' fill={fill} />
        </svg>
    );
};
