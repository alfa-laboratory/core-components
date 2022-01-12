import { GlobalStore } from './GlobalStore';
import { ModalStore, SavedStyle } from './ModalStore';

export { SavedStyle };

export const getCoreComponentsStore = (): GlobalStore => {
    if (!window.coreComponentsStore) {
        window.coreComponentsStore = new GlobalStore(new ModalStore());

        return window.coreComponentsStore;
    }

    return window.coreComponentsStore;
};
