import { ModalStore } from './ModalStore';

export class GlobalStore {
    private readonly modalStore: ModalStore;

    constructor() {
        this.modalStore = new ModalStore();
    }

    getModalStore = () => this.modalStore;
}
