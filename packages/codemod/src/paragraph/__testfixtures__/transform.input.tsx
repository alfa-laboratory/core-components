import React from 'react';
import Paragraph from 'arui-feather/paragraph';

const someVar = true;

export const Component = () => (
    <React.Fragment>
        <Paragraph view='small'>Paragraph small</Paragraph>
        <Paragraph view='normal'>Paragraph normal</Paragraph>
        <Paragraph view='lead'>Paragraph lead</Paragraph>
        <Paragraph mark='mark' data-test-id='testId'>Paragraph</Paragraph>
        <Paragraph view={someVar ? 'small' : 'normal'}>Paragraph</Paragraph>
    </React.Fragment>
);
