import { GlobalStore } from './GlobalStore';
import { ModalStore, SavedStyle } from './ModalStore';

export { SavedStyle };

const getCoreComponentsStore = (): GlobalStore => {
    if (!window.coreComponentsStore) {
        window.coreComponentsStore = new GlobalStore(new ModalStore());

        return window.coreComponentsStore;
    }

    return window.coreComponentsStore;
};

export const getModalStore = (): ModalStore => getCoreComponentsStore().getModalStore();
