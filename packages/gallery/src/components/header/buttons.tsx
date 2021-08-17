import React, { Fragment } from 'react';

import { Tooltip } from '@alfalab/core-components-tooltip';

type Props = {
    onClick?: () => void;
};

export const Fullscreen: React.FunctionComponent<Props> = ({ onClick }) => (
    <Tooltip
        trigger='hover'
        position='bottom'
        content={<Fragment>Открыть в полноэкранном режиме</Fragment>}
    >
        <button type='button' onClick={onClick}>
            <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.3213 2.25142L9.6084 6.96432L11.0226 8.37853L15.7495 3.65163L15.7495 7.25142H17.7495V0.251425H16.3241L16.3227 0.25L16.3213 0.251425H10.7495V2.25142H14.3213ZM7.24902 15.7383V17.7383H0.249023V10.7383H2.24902V14.3371L6.97934 9.60678L8.39356 11.021L3.67627 15.7383H7.24902Z'
                    fill='white'
                />
            </svg>
        </button>
    </Tooltip>
);

export const ExitFullscreen: React.FunctionComponent<Props> = ({ onClick }) => (
    <Tooltip
        trigger='hover'
        position='bottom'
        content={<Fragment>Выйти из полноэкранного режима</Fragment>}
    >
        <button type='button' onClick={onClick}>
            <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.3848 7.03744L19.4583 1.96402L18.044 0.549805L12.9569 5.63693L12.9569 2.03745L10.9569 2.03745L10.9569 9.03745L17.9569 9.03744V7.03744L14.3848 7.03744ZM2.04203 12.9655V10.9655L7.6139 10.9655L7.61474 10.9647L7.61557 10.9655L9.04203 10.9655V17.9655H7.04203L7.04203 14.3658L1.96109 19.4467L0.546875 18.0325L5.61389 12.9655H2.04203Z'
                    fill='white'
                />
            </svg>
        </button>
    </Tooltip>
);

export const Download: React.FunctionComponent<Props> = ({ onClick }) => (
    <Tooltip trigger='hover' position='bottom' content={<Fragment>Скачать</Fragment>}>
        <button type='button' onClick={onClick}>
            <svg
                width='16'
                height='18'
                viewBox='0 0 16 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.99951 10.3042L12.4439 6.93523L13.8424 8.36503L7.99951 14.0799L2.15662 8.36502L3.55508 6.93523L6.99951 10.3042V0H8.99951V10.3042ZM15.9995 16V18H-0.000488281V16H15.9995Z'
                    fill='white'
                />
            </svg>
        </button>
    </Tooltip>
);

export const Exit: React.FunctionComponent<Props> = ({ onClick }) => (
    <button type='button' onClick={onClick}>
        <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M-0.000488281 10.5L4.58537 6.00009L-0.000488281 1.5L1.49951 0L5.99959 4.58588L10.4995 0L11.9995 1.5L7.4138 6.00009L11.9995 10.5L10.4995 12L5.99959 7.41431L1.49951 12L-0.000488281 10.5Z'
                fill='white'
            />
        </svg>
    </button>
);
