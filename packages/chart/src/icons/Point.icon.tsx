import React from 'react';

type Props = {
    fill?: string;
};

const PointIcon = ({ fill = '#5A8ECF' }: Props) => (
    <svg viewBox='0 0 18 18'>
        <circle cx='9' cy='9' r='9' strokeWidth='1' fill={fill} fillOpacity='0.4' />
        <circle cx='9' cy='9' r='3' strokeWidth='2' stroke='#fff' fill={fill} />
    </svg>
);

export default PointIcon;
