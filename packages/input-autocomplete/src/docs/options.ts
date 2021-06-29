export const options = [
    { key: 'Neptunium', content: 'Neptunium' },
    { key: 'Plutonium', content: 'Plutonium' },
    { key: 'Americium', content: 'Americium' },
    { key: 'Curium', content: 'Curium' },
    { key: 'Berkelium', content: 'Berkelium' },
    { key: 'Californium', content: 'Californium' },
    { key: 'Einsteinium', content: 'Einsteinium' },
    { key: 'Fermium', content: 'Fermium' },
    { key: 'Mendelevium', content: 'Mendelevium' },
    { key: 'Nobelium', content: 'Nobelium' },
    { key: 'Lawrencium', content: 'Lawrencium' },
    { key: 'Rutherfordium', content: 'Rutherfordium' },
    { key: 'Dubnium', content: 'Dubnium' },
    { key: 'Seaborgium', content: 'Seaborgium' },
    { key: 'Bohrium', content: 'Bohrium' },
];

export const matchOption = (option: { content: string }, inputValue: string) =>
    option.content.toLowerCase().includes((inputValue || '').toLowerCase());
