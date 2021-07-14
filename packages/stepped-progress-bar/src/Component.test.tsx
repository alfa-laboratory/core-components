import React from 'react';
import { render } from '@testing-library/react';

import { SteppedProgressBar } from './Component';

const defaultProps = {
    description: 'Шаг 1 из 10: Выбор карты',
    step: 2,
    maxStep: 10,
};

describe('SteppedProgressBar/Snapshots', () => {
    it('0 < step <= maxStep', () => {
        expect(render(<SteppedProgressBar {...defaultProps} />).container).toMatchSnapshot();
    });
    it('step < 0', () => {
        expect(
            render(
                <SteppedProgressBar
                    {...defaultProps}
                    step={defaultProps.step - defaultProps.maxStep}
                />,
            ).container,
        ).toMatchSnapshot();
    });
    it('step === 0', () => {
        expect(
            render(<SteppedProgressBar {...defaultProps} step={0} />).container,
        ).toMatchSnapshot();
    });
    it('step === maxStep', () => {
        expect(
            render(<SteppedProgressBar {...defaultProps} step={defaultProps.maxStep} />).container,
        ).toMatchSnapshot();
    });
    it('step > maxStep', () => {
        expect(
            render(
                <SteppedProgressBar
                    {...defaultProps}
                    step={defaultProps.maxStep + defaultProps.step}
                />,
            ).container,
        ).toMatchSnapshot();
    });
    it('maxStep === 0', () => {
        expect(
            render(<SteppedProgressBar {...defaultProps} maxStep={0} />).container,
        ).toMatchSnapshot();
    });
    it('maxStep < 0', () => {
        expect(
            render(<SteppedProgressBar {...defaultProps} maxStep={-defaultProps.maxStep} />)
                .container,
        ).toMatchSnapshot();
    });
    it('no description', () => {
        expect(
            render(
                <SteppedProgressBar
                    {...defaultProps}
                    description=''
                    maxStep={-defaultProps.maxStep}
                />,
            ).container,
        ).toMatchSnapshot();
    });
});
