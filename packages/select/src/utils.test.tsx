import React from 'react';
import { joinOptions } from './utils';
import { OptionShape } from './typings';

describe('joinOptions', () => {
    const textOptions: OptionShape[] = [
        { value: '1', text: 'Neptunium' },
        { value: '2', text: 'Plutonium' },
        { value: '3', text: 'Americium' },
        { value: '4', text: 'Curium' },
    ];

    const htmlOptions: OptionShape[] = [
        { value: '1', text: 'Neptunium', content: <b>Neptunium</b> },
        { value: '2', text: 'Plutonium', content: <b>Plutonium</b> },
        { value: '3', text: 'Americium', content: <b>Americium</b> },
        { value: '4', text: 'Curium', content: <b>Curium</b> },
    ];

    it('should match snapshots', () => {
        expect(joinOptions(textOptions)).toMatchSnapshot();
        expect(joinOptions(htmlOptions)).toMatchSnapshot();
    });
});
