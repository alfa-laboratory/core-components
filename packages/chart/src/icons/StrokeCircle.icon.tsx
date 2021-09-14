import React from 'react';

type Props = {
    fill?: string;
    height?: number;
};

const StrokeCircleIcon = ({ fill = '#5A8ECF', height = 16 }: Props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='auto'
            height={height}
            viewBox='0 0 22 22'
            fill='none'
        >
            <circle cx='11' cy='11' r='10' stroke={fill} strokeWidth='2' strokeDasharray='8 8' />
        </svg>
    );
};

export default StrokeCircleIcon;
