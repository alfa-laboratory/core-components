import React, { SVGProps } from 'react';
import * as icons from '@alfalab/icons-flag';

type IconProps = SVGProps<SVGSVGElement>;

type CountryFlags = {
    [iso2: string]: (props: IconProps) => JSX.Element;
};

// TODO: dynamic import
export const countriesFlags: CountryFlags = {
    ru: props => <icons.RussiaMColorIcon {...props} />,
    az: props => <icons.AzerbaijanMColorIcon {...props} />,
};
