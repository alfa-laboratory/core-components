import React from 'react';
import { render } from '@testing-library/react';

import { StarMIcon } from '@alfalab/icons-glyph/StarMIcon';
import { Link } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<Link href=''>Link</Link>)).toMatchSnapshot();
    });

    it('should render left slot', () => {
        expect(
            render(
                <Link href='' leftAddons={<StarMIcon />}>
                    Link
                </Link>,
            ),
        ).toMatchSnapshot();
    });

    it('should render right slot', () => {
        expect(
            render(
                <Link href='' rightAddons={<StarMIcon />}>
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

    it('should set rel="noreferrer noopener" if prop "target" is "_blank"', () => {
        const { container } = render(
            <Link href='' target='_blank'>
                Link
            </Link>,
        );

        const relAttr = container.firstElementChild?.getAttribute('rel');

        expect(relAttr).toBe('noreferrer noopener');
    });
});

describe('Custom component', () => {
    it('should use custom component and replace `href` to `to`', () => {
        const cb = jest.fn();
        cb.mockReturnValue(null);

        render(
            <Link Component={cb} href='test'>
                Link
            </Link>,
        );

        expect(cb).toBeCalled();

        const props = cb.mock.calls[0][0];

        expect(props.href).toBeFalsy();
        expect(props.to).toBe('test');
    });
});

describe('Render tests', () => {
    it('should unmount without errors', () => {
        const { unmount } = render(<Link href=''>Link</Link>);

        expect(unmount).not.toThrowError();
    });
});
