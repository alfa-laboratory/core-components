import React from 'react';
import { render } from '@testing-library/react';

import Icon from '@alfalab/icons-glyph/StarMIcon';
import { Link } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<Link href=''>Link</Link>)).toMatchSnapshot();
    });

    it('should render left slot', () => {
        expect(
            render(
                <Link href='' leftSlot={<Icon />}>
                    Link
                </Link>,
            ),
        ).toMatchSnapshot();
    });

    it('should render right slot', () => {
        expect(
            render(
                <Link href='' rightSlot={<Icon />}>
                    Link
                </Link>,
            ),
        ).toMatchSnapshot();
    });
});

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(
            <Link className={className} href=''>
                Link
            </Link>,
        );

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set view `primary` as default view', () => {
        const { container } = render(<Link href=''>Link</Link>);

        expect(container.firstElementChild).toHaveClass('primary');
    });

    it('should set view', () => {
        const { container } = render(
            <Link href='' view='default'>
                Link
            </Link>,
        );

        expect(container.firstElementChild).toHaveClass('default');
    });

    it('should set `pseudo` class if prop `pseudo` is present', () => {
        const { container } = render(
            <Link href='' pseudo={true}>
                Link
            </Link>,
        );

        expect(container.firstElementChild).toHaveClass('pseudo');
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', () => {
        const dataTestId = 'link-test-id';

        const { container } = render(
            <Link href='' dataTestId={dataTestId}>
                Link
            </Link>,
        );

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(dataTestId);
    });
});

describe('Render tests', () => {
    it('should unmount without errors', () => {
        const { unmount } = render(<Link href=''>Link</Link>);

        expect(unmount).not.toThrowError();
    });
});
