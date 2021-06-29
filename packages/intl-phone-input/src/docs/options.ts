export const options = [
    {
        key: '+7 921 681 53 98',
        content: '+7 921 681 53 98',
    },
    {
        key: '+7 921 681 52 97',
        content: '+7 921 681 52 97',
    },
    {
        key: '+7 921 681 52 96',
        content: '+7 921 681 52 96',
    },
    {
        key: '+7 921 681 52 95',
        content: '+7 921 681 52 95',
    },
    {
        key: '+7 921 681 52 94',
        content: '+7 921 681 52 94',
    },
];

export const matchOption = (option: { key: string }, inputValue: string) =>
    option.key.toLowerCase().includes((inputValue || '').toLowerCase());
