export type SavedStyle = {
    value: string;
    key: string;
    el: HTMLElement;
};

type RestoreStyle = {
    container: HTMLElement;
    modals: number;
    styles: SavedStyle[];
};

export class ModalStore {
    private readonly restoreStyles: RestoreStyle[];

    constructor() {
        this.restoreStyles = [];
    }

    getRestoreStyles = () => this.restoreStyles;
}
