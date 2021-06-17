import React from 'react';
import { Typography } from '@alfalab/core-components/typography';

const someVar = true;

export const Component = () => (
    <React.Fragment>
        <Typography.Text view='primary-small' color='primary'>Paragraph small</Typography.Text>
        <Typography.Text view='primary-medium' color='primary'>Paragraph normal</Typography.Text>
        <Typography.Title view='small' weight='regular' tag='h4' font='system' color='primary'>Paragraph lead</Typography.Title>
        <Typography.Text mark='mark' dataTestId='testId' color='primary'>Paragraph</Typography.Text>
        <Typography.Text view={someVar ? 'small' : 'normal'} color='primary'>Paragraph</Typography.Text>
    </React.Fragment>
);
