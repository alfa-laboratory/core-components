import React from 'react';

export const SpinnerIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox='0 0 200 200'
    >
        <defs>
            <clipPath id='a'>
                <path d='M175 100c0 19.9-7.8 38.7-22.1 52.9-14.2 14.2-33 22.1-52.9 22.1s-38.7-7.8-52.9-22.1C32.8 138.7 25 119.9 25 100s7.8-38.7 22.1-52.9C61.3 32.8 80.1 25 100 25s38.7 7.8 52.9 22.1c10.3 10.3 17.3 23.1 20.3 36.9l24.5-5.2C187.9 33.9 147.7 0 100 0 45 0 0 45 0 100s45 100 100 100 100-45 100-100h-25z' />
            </clipPath>
            <filter id='b' x='0' y='0'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='3' />
            </filter>
            <path id='c' d='M250 100a150 150 0 01-3.28 31.19L100 100z' fill='#0B1F35' />
        </defs>
        <g clipPath='url(#a)'>
            <g filter='url(#b)' transform='rotate(-6 100 100)'>
                <use xlinkHref='#c' fillOpacity='0' />
                <use xlinkHref='#c' fillOpacity='0' transform='rotate(12 100 100)' />
                <use xlinkHref='#c' fillOpacity='0' transform='rotate(24 100 100)' />
                <use xlinkHref='#c' fillOpacity='0' transform='rotate(36 100 100)' />
                <use xlinkHref='#c' fillOpacity='0' transform='rotate(48 100 100)' />
                <use xlinkHref='#c' fillOpacity='.04' transform='rotate(60 100 100)' />
                <use xlinkHref='#c' fillOpacity='.08' transform='rotate(72 100 100)' />
                <use xlinkHref='#c' fillOpacity='.12' transform='rotate(84 100 100)' />
                <use xlinkHref='#c' fillOpacity='.16' transform='rotate(96 100 100)' />
                <use xlinkHref='#c' fillOpacity='.2' transform='rotate(108 100 100)' />
                <use xlinkHref='#c' fillOpacity='.24' transform='rotate(120 100 100)' />
                <use xlinkHref='#c' fillOpacity='.28' transform='rotate(132 100 100)' />
                <use xlinkHref='#c' fillOpacity='.32' transform='rotate(144 100 100)' />
                <use xlinkHref='#c' fillOpacity='.36' transform='rotate(156 100 100)' />
                <use xlinkHref='#c' fillOpacity='.4' transform='rotate(168 100 100)' />
                <use xlinkHref='#c' fillOpacity='.44' transform='rotate(180 100 100)' />
                <use xlinkHref='#c' fillOpacity='.48' transform='rotate(192 100 100)' />
                <use xlinkHref='#c' fillOpacity='.52' transform='rotate(204 100 100)' />
                <use xlinkHref='#c' fillOpacity='.56' transform='rotate(216 100 100)' />
                <use xlinkHref='#c' fillOpacity='.6' transform='rotate(228 100 100)' />
                <use xlinkHref='#c' fillOpacity='.64' transform='rotate(240 100 100)' />
                <use xlinkHref='#c' fillOpacity='.68' transform='rotate(252 100 100)' />
                <use xlinkHref='#c' fillOpacity='.72' transform='rotate(264 100 100)' />
                <use xlinkHref='#c' fillOpacity='.76' transform='rotate(276 100 100)' />
                <use xlinkHref='#c' fillOpacity='.8' transform='rotate(288 100 100)' />
                <use xlinkHref='#c' fillOpacity='.84' transform='rotate(300 100 100)' />
                <use xlinkHref='#c' fillOpacity='.88' transform='rotate(312 100 100)' />
                <use xlinkHref='#c' fillOpacity='.92' transform='rotate(324 100 100)' />
                <use xlinkHref='#c' fillOpacity='.96' transform='rotate(336 100 100)' />
                <use xlinkHref='#c' transform='rotate(348 100 100)' />
            </g>
        </g>
    </svg>
);
