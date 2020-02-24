/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Divider, DividerProps } from './index';

const styles = require('./Component.module.css');

describe('Divider', () => {
  it('should have a default orientation', () => {
    const defaultOrientationClass = styles.horizontal;
    const { container } = render(<Divider />);

    expect(container.firstElementChild?.classList).toContain(
      defaultOrientationClass
    );
  });

  it('should use an orientation prop', () => {
    const orientation: DividerProps['orientation'] = 'vertical';
    const orientationClass = styles[orientation];
    const { container } = render(<Divider orientation={orientation} />);

    expect(container.firstElementChild?.classList).toContain(orientationClass);
  });

  it('should have an original look', () => {
    const accentClass = styles.accent;
    const { container } = render(<Divider />);

    expect(container.firstElementChild?.classList).not.toContain(accentClass);
  });

  it('should use an accent prop', () => {
    const accentClass = styles.accent;
    const { container } = render(<Divider accent={true} />);

    expect(container.firstElementChild?.classList).toContain(accentClass);
  });

  it('should have a default test identifier', () => {
    const { container } = render(<Divider />);

    expect(container.firstElementChild).toHaveAttribute('data-testid');
  });

  it('should use a dataTestId prop', () => {
    const testId = 'header-divider';
    const { getByTestId } = render(<Divider dataTestId={testId} />);

    expect(getByTestId(testId)).toBeTruthy;
  });

  it('should use a className prop', () => {
    const className = 'short';
    const { container } = render(<Divider className={className} />);

    expect(container.firstElementChild?.classList).toContain(className);
  });
});
