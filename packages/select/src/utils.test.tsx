import React from 'react';
import { joinOptions } from './utils';
import { OptionShape } from './typings';

describe('joinOptions', () => {
    const textOptions: OptionShape[] = [
        { key: '1', content: 'Neptunium' },
        { key: '2', content: 'Plutonium' },
        { key: '3', content: 'Americium' },
        { key: '4', content: 'Curium' },
    ];

    const htmlOptions: OptionShape[] = [
        { key: 'Neptunium', content: <b>Neptunium</b> },
        { key: 'Plutonium', content: <b>Plutonium</b> },
        { key: 'Americium', content: <b>Americium</b> },
        { key: 'Curium', content: <b>Curium</b> },
    ];

    it('should match snapshots', () => {
        expect(joinOptions({ selectedMultiple: textOptions })).toMatchSnapshot();
        expect(joinOptions({ selectedMultiple: htmlOptions })).toMatchSnapshot();
        expect(joinOptions({ selected: textOptions[0] })).toMatchSnapshot();
        expect(joinOptions({ selected: htmlOptions[0] })).toMatchSnapshot();
        expect(joinOptions({ selectedMultiple: [] })).toMatchSnapshot();
        expect(joinOptions({ selected: undefined })).toMatchSnapshot();
    });
});
