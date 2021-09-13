import React from 'react';

type Props = {
    fill?: string;
};

const FilledCircleIcon = ({ fill = '#5A8ECF' }: Props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
        >
            <circle
                cx='11'
                cy='11'
                r='10'
                fill='url(#paint0_linear)'
                stroke={fill}
                strokeWidth='2'
            />
            <defs>
                <linearGradient
                    id='paint0_linear'
                    x1='11'
                    y1='1'
                    x2='11'
                    y2='21'
                    gradientUnits='userSpaceOnUse'
                >
                    <stop stopColor={fill} stopOpacity='0.2' />
                    <stop offset='1' stopColor={fill} stopOpacity='0' />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default FilledCircleIcon;
