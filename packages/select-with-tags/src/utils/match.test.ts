import { filterOptions } from './match';

const options = [
    { key: '4', content: 'Curium', value: 'Curium' },
    { key: '5', content: 'Berkelium', value: 'Berkelium' },
    { key: '6', content: 'Californium', value: 'Californium' },
];

const optionsGroup = [
    {
        label: 'Label 1',
        options: [{ key: '4', content: 'Curium', value: 'Curium' }],
    },
    {
        label: 'Label 2',
        options: [
            { key: '1', content: 'H', value: 'H' },
            { key: '2', content: 'Li', value: 'Li' },
        ],
    },
];

describe('Filter options tests', () => {
    it('should filter options', () => {
        const filtered = filterOptions(options, 'cu');

        expect(filtered).toEqual([{ key: '4', content: 'Curium', value: 'Curium' }]);
    });

    it('should filter options group', () => {
        const filtered = filterOptions(optionsGroup, 'cu');

        expect(filtered).toEqual([
            {
                label: 'Label 1',
                options: [{ key: '4', content: 'Curium', value: 'Curium' }],
            },
        ]);
    });

    it('should call match function', () => {
        const match = jest.fn();

        filterOptions(optionsGroup, 'cu', match);

        expect(match).toBeCalled();
    });
});
