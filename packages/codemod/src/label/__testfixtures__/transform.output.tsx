import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Typography } from '@alfalab/core-components/typography';

const someVar = true;

export const Component = () => (
    <React.Fragment>
        <Typography.Text view='primary-small' color='primary'>Label s</Typography.Text>
        <Typography.Text view='primary-medium' color='primary'>Label m</Typography.Text>
        <Typography.Text view='primary-large' color='primary'>Label l</Typography.Text>
        <Typography.Title view='xsmall' font='system' color='primary'>Label xl</Typography.Title>
        <Typography.Title view='medium' font='system' color='primary'>Label 2xl</Typography.Title>
        <Typography.Title view='large' font='system' color='primary'>Label 3xl</Typography.Title>
        <Typography.Title view='xlarge' font='system' color='primary'>Label 4xl</Typography.Title>
        <Typography.Text color='primary'>Label without props</Typography.Text>
        <Typography.Text className='custom' dataTestId='test-id' id='id' isNoWrap={true} color='primary'>Label</Typography.Text>
        <Typography.Text view={someVar ? 's' : '3xl'} color='primary'>Label</Typography.Text>
    </React.Fragment>
);
