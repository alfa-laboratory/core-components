import React from 'react';
import { Typography } from '@alfalab/core-components/typography';

const someVar = false;

export const Component = () => (
    <React.Fragment>
        <Typography.TitleResponsive view='xsmall' tag='h5' defaultMargins={true} font='system' color='primary'>Heading xs</Typography.TitleResponsive>
        <Typography.TitleResponsive view='small' defaultMargins={true} tag='h4' font='system' color='primary'>Heading s</Typography.TitleResponsive>
        <Typography.TitleResponsive view='medium' tag='h3' defaultMargins={true} font='system' color='primary'>Heading m</Typography.TitleResponsive>
        <Typography.TitleResponsive view='large' tag='h2' defaultMargins={true} font='system' color='primary'>Heading l</Typography.TitleResponsive>
        <Typography.TitleResponsive view='xlarge' tag='h1' defaultMargins={true} font='system' color='primary'>Heading xl</Typography.TitleResponsive>
        <Typography.TitleResponsive className='custom' dataTestId='test-id' id='id' view='xlarge' tag='h1' font='system' color='primary'>Heading</Typography.TitleResponsive>
        <Typography.TitleResponsive view={someVar ? 'xs' : 'l'} defaultMargins={true} font='system' color='primary'>Heading</Typography.TitleResponsive>
    </React.Fragment>
);
