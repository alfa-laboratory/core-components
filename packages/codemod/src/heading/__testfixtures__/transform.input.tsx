import React from 'react';
import Heading from 'arui-feather/heading';

const someVar = false;

export const Component = () => (
    <React.Fragment>
        <Heading size='xs'>Heading xs</Heading>
        <Heading size='s' hasDefaultMargins={true}>Heading s</Heading>
        <Heading size='m'>Heading m</Heading>
        <Heading size='l'>Heading l</Heading>
        <Heading size='xl'>Heading xl</Heading>
        <Heading className='custom' data-test-id='test-id' id='id' hasDefaultMargins={false}>Heading</Heading>
        <Heading size={someVar ? 'xs' : 'l'}>Heading</Heading>
    </React.Fragment>
);
