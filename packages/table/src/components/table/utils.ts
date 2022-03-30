import React from 'react';
import { THead } from '../thead';
import { THeadCellProps } from '../thead-cell';
import { isChildInstanceOf } from '../../utils';

export function findAllHeadCellsProps(children: React.ReactElement[]) {
    const result: THeadCellProps[] = [];

    React.Children.forEach(children, child => {
        if (isChildInstanceOf(child, THead)) {
            React.Children.forEach(child.props.children, headChild => {
                result.push(headChild.props);
            });
        }
    });

    return result;
}
