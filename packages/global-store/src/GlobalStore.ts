import { ModalStore } from './ModalStore';

export class GlobalStore {
    private readonly modalStore: ModalStore;

    constructor(modalStore: ModalStore) {
        this.modalStore = modalStore;
    }

    getModalsStore = () => this.modalStore;
}
