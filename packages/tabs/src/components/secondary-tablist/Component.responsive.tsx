import React from 'react';
import { SecondaryTabListDesktop, SecondaryTabListMobile } from './index';
import { SecondaryTabListProps } from '../../typings';
import { useWindowWidth } from '../../utils';

export const SecondaryTabListResponsive = ({ size, ...restProps }: SecondaryTabListProps) => {
    return useWindowWidth() >= 768 ? (
        <SecondaryTabListDesktop size={size} {...restProps} />
    ) : (
        <SecondaryTabListMobile {...restProps} />
    );
};
