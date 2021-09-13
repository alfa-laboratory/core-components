import React from 'react';

type Props = {
    fill?: string;
};

const CircleIcon = ({ fill = '#FF5C5C' }: Props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
        >
            <circle cx='8' cy='8' r='8' fill={fill} />
        </svg>
    );
};

export default CircleIcon;
