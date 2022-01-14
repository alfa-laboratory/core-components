import { ModalStore } from './ModalStore';

export class GlobalStore {
    private readonly modalStore: ModalStore;

    constructor(modalStore: ModalStore) {
        this.modalStore = modalStore;
    }

    getModalStore = () => this.modalStore;
}
