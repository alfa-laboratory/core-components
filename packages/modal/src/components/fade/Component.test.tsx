/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';

import { Fade } from './index';

describe('Fade', () => {
    it('should use a children', () => {
        const text = 'Lorem ipsum';
        const { getByText } = render(<Fade show={true}>{text}</Fade>);

        expect(getByText(text)).toHaveTextContent(text);
    });

    it('should use a className prop', () => {
        const className = 'test-class';
        const { container } = render(<Fade show={true} className={className} />);

        expect(container.firstElementChild?.classList).toContain(className);
    });

    it('should use a dataTestId prop', () => {
        const fadeTestId = 'fade-test-id';
        const { getByTestId } = render(<Fade show={true} dataTestId={fadeTestId} />);

        expect(getByTestId(fadeTestId)).toHaveAttribute('data-test-id', fadeTestId);
    });
});
