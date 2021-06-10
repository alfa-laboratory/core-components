import React from 'react';
import Label from 'arui-feather/label';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Typography } from '@alfalab/core-components/typography';

const someVar = true;

export const Component = () => (
    <React.Fragment>
        <Label size='s'>Label s</Label>
        <Label size='m'>Label m</Label>
        <Label size='l'>Label l</Label>
        <Label size='xl'>Label xl</Label>
        <Label size='2xl'>Label 2xl</Label>
        <Label size='3xl'>Label 3xl</Label>
        <Label size='4xl'>Label 4xl</Label>
        <Label>Label without props</Label>
        <Label className='custom' data-test-id='test-id' id='id' isNoWrap={true}>Label</Label>
        <Label size={someVar ? 's' : '3xl'}>Label</Label>
    </React.Fragment>
);
