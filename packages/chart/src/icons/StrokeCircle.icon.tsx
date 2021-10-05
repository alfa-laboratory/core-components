import React from 'react';

type Props = {
    fill?: string;
};

const StrokeCircleIcon = ({ fill = '#5A8ECF' }: Props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
        >
            <circle cx='11' cy='11' r='10' stroke={fill} strokeWidth='2' strokeDasharray='8 8' />
        </svg>
    );
};

export default StrokeCircleIcon;
