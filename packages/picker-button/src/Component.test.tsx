import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { PickerButton } from './index';

const testId = 'picker-button-test-id';
const className = 'pickerButtonClassName';
const label = 'some label';
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

const clickPickerButton = () => {
    const button = document.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);
};

describe('Snapshots tests', () => {
    it('should display correctly', () => {
        const { container } = render(<PickerButton label={label} options={options} />);

        expect(container).toMatchSnapshot();
    });

    it('should display opened correctly', async () => {
        const { container } = render(<PickerButton options={options} />);

        clickPickerButton();

        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', async () => {
        render(<PickerButton className={className} dataTestId={testId} options={options} />);

        const container = document.querySelector(`.${className}`);

        const testIdAttr = container?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(testId);
    });

    it('should have disabled attribute', async () => {
        render(<PickerButton disabled={true} options={options} />);

        const button = document.querySelector('button');

        expect(button).toHaveAttribute('disabled');
    });
});

describe('Render tests', () => {
    it('should unmount without errors', async () => {
        const { unmount } = render(<PickerButton options={options} />);

        expect(unmount).not.toThrowError();
    });

    it('should have loading class', async () => {
        render(<PickerButton options={options} loading={true} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass('loading');
    });

    it('should have primary class', async () => {
        const view = 'primary';
        render(<PickerButton options={options} view={view} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass(view);
    });

    it('should have m class, icon size = 24, secondary class by default', async () => {
        const iconSize = '24';
        const { getByTestId } = render(<PickerButton options={options} />);
        const button = document.querySelector('button');
        const icon = getByTestId('picker-button-icon');

        expect(button).toHaveClass('m');
        expect(button).toHaveClass('secondary');
        expect(icon.getAttribute('width')).toBe(iconSize);
        expect(icon.getAttribute('height')).toBe(iconSize);
    });

    it('should have xs class and small icon', async () => {
        const size = 'xs';
        const iconSize = '18';

        const { getByTestId } = render(<PickerButton options={options} size={size} />);
        const button = document.querySelector('button');
        const icon = getByTestId('picker-button-icon');

        expect(button).toHaveClass(size);
        expect(icon.getAttribute('width')).toBe(iconSize);
        expect(icon.getAttribute('height')).toBe(iconSize);
    });

    it('should have open class if opened', async () => {
        render(<PickerButton label={label} options={options} />);

        clickPickerButton();

        await waitFor(() => {
            const iconContainer = document.querySelector('.iconContainer');
            expect(iconContainer).toHaveClass('open');
        });
    });

    it('should have options if opened', async () => {
        render(<PickerButton label={label} options={options} />);

        clickPickerButton();

        await waitFor(() => {
            const renderedOptions = document.querySelectorAll('.option');
            expect(renderedOptions).toHaveLength(options.length);
        });
    });
});
