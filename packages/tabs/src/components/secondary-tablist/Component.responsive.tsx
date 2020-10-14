import React from 'react';
import { SecondaryTabListDesktop } from './Component.desktop';
import { SecondaryTabListMobile } from './Component.mobile';
import { SecondaryTabListProps } from '../../typings';
import { useWindowWidth } from '../../utils';

export const SecondaryTabListResponsive = ({ size, ...restProps }: SecondaryTabListProps) => {
    return useWindowWidth() >= 768 ? (
        <SecondaryTabListDesktop size={size} {...restProps} />
    ) : (
        <SecondaryTabListMobile {...restProps} />
    );
};
