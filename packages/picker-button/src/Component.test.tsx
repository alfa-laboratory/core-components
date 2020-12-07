import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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

describe('Snapshots tests', () => {
    it('should display correctly', () => {
        const { container } = render(<PickerButton label={label} options={options} />);

        expect(container).toMatchSnapshot();
    });

    it('should display opened correctly', () => {
        const { container } = render(<PickerButton options={options} />);

        const button = document.querySelector('button');

        if (button) fireEvent.click(button);

        expect(container).toMatchSnapshot();
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

    it('should have secondary class by default', async () => {
        render(<PickerButton options={options} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass('secondary');
    });

    it('should have primary class', async () => {
        const view = 'primary';
        render(<PickerButton options={options} view={view} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass(view);
    });

    it('should have s class by default', async () => {
        const size = 's';
        render(<PickerButton options={options} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass(size);
    });

    it('should have m class', async () => {
        const size = 'm';
        render(<PickerButton options={options} size={size} />);
        const button = document.querySelector('button');

        expect(button).toHaveClass(size);
    });

    it('should have open class if opened', () => {
        render(<PickerButton label={label} options={options} />);

        const button = document.querySelector('button');

        const iconContainer = document.querySelector('.iconContainer');

        if (button) fireEvent.click(button);

        expect(iconContainer).toHaveClass('open');
    });

    it('should have options if opened', () => {
        render(<PickerButton label={label} options={options} />);

        const button = document.querySelector('button') as HTMLButtonElement;

        fireEvent.click(button);

        const renderedOptions = document.querySelectorAll('.option');

        expect(renderedOptions).toHaveLength(options.length);
    });
});
