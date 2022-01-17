export declare global {
    import { GlobalStore } from '../packages/global-store/src/GlobalStore';

    interface Window {
        coreComponentsStore: GlobalStore;
    }
}
