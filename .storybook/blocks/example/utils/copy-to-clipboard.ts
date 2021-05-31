export const copyToClipboard = async (text: string) => {
    if (navigator && navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    }

    const tmp = document.createElement('textarea');
    const focus = document.activeElement as HTMLElement;

    tmp.value = text;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);

    if (focus) {
        focus.focus();
    }
};
