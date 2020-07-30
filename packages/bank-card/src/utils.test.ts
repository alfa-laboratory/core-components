import { validateCardNumber } from './utils';

describe('validateCardNumber', () => {
    const VISA_VALID_NUMBER = '4111111111111111';
    const MC_VALID_NUMBER = '5500000000000004';
    const MIR_VALID_NUMBER = '2201382000000013';

    it('should pass correct VISA number', () => {
        expect(validateCardNumber(VISA_VALID_NUMBER)).toBe(true);
    });

    it('should pass correct MASTER CARD number', () => {
        expect(validateCardNumber(MC_VALID_NUMBER)).toBe(true);
    });

    it('should pass correct MIR number', () => {
        expect(validateCardNumber(MIR_VALID_NUMBER)).toBe(true);
    });

    it('should pass correct number with spaces', () => {
        expect(validateCardNumber(`${MIR_VALID_NUMBER} `)).toBe(true);
        expect(validateCardNumber(` ${MIR_VALID_NUMBER}`)).toBe(true);
        expect(validateCardNumber(` ${MIR_VALID_NUMBER} `)).toBe(true);

        expect(validateCardNumber('5500 0000 0000 0004')).toBe(true);
        expect(validateCardNumber('5 5 0 0 0 0 0 0 0 0 0 0 0 0 0 4')).toBe(true);
    });

    describe('Random large number examples', () => {
        const randomExamples = [];
        const possible = '0123456789';

        // generate random examples
        for (let i = 0; i < 10; i++) {
            let example = '';
            for (let j = 0; j < 15; j++) {
                example += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            randomExamples.push(example);
        }

        randomExamples.forEach(example => {
            it(`should have exactly one valid checksum digit after ${example}`, () => {
                let validCount = 0;
                for (let i = 0; i < 10; i++) {
                    const number = `${example}${i}`;
                    if (validateCardNumber(number)) {
                        validCount += 1;
                    }
                }
                expect(validCount).toBe(1);
            });
        });
    });
});
