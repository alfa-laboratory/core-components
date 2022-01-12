import { ModalStore } from './ModalStore';

export class GlobalStore {
    private modalStore: ModalStore;

    constructor(modalStore: ModalStore) {
        this.modalStore = modalStore;
    }

    getModalRestoreStyles = () => this.modalStore.getRestoreStyles();
}
