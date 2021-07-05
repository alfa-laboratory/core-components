import React from 'react';
import { getOptionsFingerprint, joinOptions, processOptions } from './utils';
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

describe('processOptions', () => {
    const options = [
        { key: '1', content: 'Neptunium' },
        { key: '2', content: 'Plutonium' },
        { key: '3', content: 'Americium' },
        { key: '4', content: 'Curium' },
        { key: '5', content: 'Berkelium' },
        { key: '6', content: 'Californium' },
        { key: '7', content: 'Einsteinium' },
        { key: '8', content: 'Fermium' },
        { key: '9', content: 'Mendelevium' },
        { key: '10', content: 'Nobelium' },
        { key: '11', content: 'Lawrencium' },
        { key: '12', content: 'Rutherfordium' },
        { key: '13', content: 'Dubnium' },
        { key: '14', content: 'Seaborgium' },
        { key: '15', content: 'Bohrium' },
    ];

    const groups = [
        {
            label: 'Группа №1',
            options: [
                { key: '1', content: 'Neptunium' },
                { key: '2', content: 'Plutonium' },
                { key: '3', content: 'Americium' },
                { key: '4', content: 'Curium' },
            ],
        },
        {
            label: 'Группа №2',
            options: [
                { key: '5', content: 'Berkelium' },
                { key: '6', content: 'Californium' },
                { key: '7', content: 'Einsteinium' },
                { key: '8', content: 'Fermium' },
                { key: '9', content: 'Mendelevium' },
                { key: '10', content: 'Nobelium' },
            ],
        },
        {
            label: 'Группа №3',
            options: [
                { key: '11', content: 'Lawrencium' },
                { key: '12', content: 'Rutherfordium' },
                { key: '13', content: 'Dubnium' },
                { key: '14', content: 'Seaborgium' },
                { key: '15', content: 'Bohrium' },
            ],
        },
    ];

    it('should work with empty lists', () => {
        const { flatOptions, selectedOptions } = processOptions([], []);

        expect(flatOptions).toEqual([]);
        expect(selectedOptions).toEqual([]);
    });

    it('should make options flat', () => {
        expect(processOptions(options).flatOptions).toEqual(options);
        expect(processOptions(groups).flatOptions).toEqual(options);
    });

    it('should return selected options by list of keys', () => {
        expect(processOptions(options, ['1', '7']).selectedOptions).toEqual([
            options[0],
            options[6],
        ]);

        expect(processOptions(groups, ['1', '7']).selectedOptions).toEqual([
            options[0],
            options[6],
        ]);

        expect(processOptions(options, ['non-existing key']).selectedOptions).toEqual([]);
        expect(processOptions(groups, ['non-existing key']).selectedOptions).toEqual([]);
    });

    it('should return selected options by list of objects', () => {
        expect(processOptions(options, [options[0], options[6]]).selectedOptions).toEqual([
            options[0],
            options[6],
        ]);

        expect(processOptions(groups, [options[0], options[6]]).selectedOptions).toEqual([
            options[0],
            options[6],
        ]);
    });

    it('should return selected options even if passed objects not in options', () => {
        expect(processOptions(options, [options[1], options[2]]).selectedOptions).toEqual([
            options[1],
            options[2],
        ]);
    });

    describe('getOptionsFingerprint', () => {
        it('should have different fingerprints for different options', () => {
            const optionsLength = options.length / 2;

            const headFingerprint = getOptionsFingerprint(options.slice(0, optionsLength));
            const tailFingerprint = getOptionsFingerprint(options.slice(optionsLength));

            expect(headFingerprint).not.toEqual(tailFingerprint);
        });

        it('should have different fingerprints for different groups', () => {
            const groupsLength = groups.length / 2;

            const headFingerprint = getOptionsFingerprint(groups.slice(0, groupsLength));
            const tailFingerprint = getOptionsFingerprint(groups.slice(groupsLength));

            expect(headFingerprint).not.toEqual(tailFingerprint);
        });

        it('should have same fingerprint for the same options', () => {
            const originalFingerprint = getOptionsFingerprint(options);
            const cloneFingerprint = getOptionsFingerprint([...options]);

            expect(originalFingerprint).toEqual(cloneFingerprint);
        });

        it('should have same fingerprint for the same groups', () => {
            const originalFingerprint = getOptionsFingerprint(groups);
            const cloneFingerprint = getOptionsFingerprint([...groups]);

            expect(originalFingerprint).toEqual(cloneFingerprint);
        });
    });
});
