import React from 'react';

type Props = {
    fill?: string;
    height?: number;
};

const CircleIcon = ({ fill = '#FF5C5C', height = 16 }: Props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='auto'
            height={height}
            viewBox='0 0 16 16'
            fill='none'
        >
            <circle cx='8' cy='8' r='8' fill={fill} />
        </svg>
    );
};

export default CircleIcon;
