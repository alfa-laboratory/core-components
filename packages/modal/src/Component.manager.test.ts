import { getScrollbarSize } from './utils';
import { ModalManager, ModalElement } from './Component.manager';

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

describe('ModalManager', () => {
    let modalManager: ModalManager;
    let container1: HTMLDivElement;

    beforeAll(() => {
        modalManager = new ModalManager();
        container1 = document.createElement('div');
        container1.style.paddingRight = '20px';
        Object.defineProperty(container1, 'scrollHeight', {
            value: 100,
            writable: false,
        });
        Object.defineProperty(container1, 'clientHeight', {
            value: 90,
            writable: false,
        });
        document.body.appendChild(container1);
    });

    afterAll(() => {
        document.body.removeChild(container1);
    });

    it('should add a modal only once', () => {
        const modal = {} as ModalElement;
        const modalManager2 = new ModalManager();
        const idx = modalManager2.add(modal, container1);
        modalManager2.mount(modal);
        expect(modalManager2.add(modal, container1)).toStrictEqual(idx);
        modalManager2.remove(modal);
    });

    describe('managing modals', () => {
        let modal1: ModalElement;
        let modal2: ModalElement;
        let modal3: ModalElement;

        beforeAll(() => {
            modal1 = {
                modalRef: document.createElement('div'),
                mountNode: document.createElement('div'),
            };
            modal2 = {
                modalRef: document.createElement('div'),
                mountNode: document.createElement('div'),
            };
            modal3 = {
                modalRef: document.createElement('div'),
                mountNode: document.createElement('div'),
            };
        });

        it('should add modal1', () => {
            const idx = modalManager.add(modal1, container1);
            modalManager.mount(modal1);
            expect(idx).toStrictEqual(0); // should be the first modal
            expect(modalManager.isTopModal(modal1)).toStrictEqual(true);
        });

        it('should add modal2', () => {
            const idx = modalManager.add(modal2, container1);
            expect(idx).toStrictEqual(1); // should be the second modal
            expect(modalManager.isTopModal(modal2)).toStrictEqual(true);
        });

        it('should add modal3', () => {
            const idx = modalManager.add(modal3, container1);
            expect(idx).toStrictEqual(2); // should be the second modal
            expect(modalManager.isTopModal(modal3)).toStrictEqual(true);
        });

        it('should remove modal2', () => {
            const idx = modalManager.remove(modal2);
            expect(idx).toStrictEqual(1); // should be the second modal
        });

        it('should add modal2 2', () => {
            const idx = modalManager.add(modal2, container1);
            modalManager.mount(modal2);
            expect(idx).toStrictEqual(2); // should be the "third" modal
            expect(modalManager.isTopModal(modal2)).toStrictEqual(true);
            // modal3 should not be the top modal
            expect(modalManager.isTopModal(modal3)).toStrictEqual(false);
        });

        it('should remove modal3', () => {
            const idx = modalManager.remove(modal3);
            expect(idx).toStrictEqual(1);
        });

        it('should remove modal2 2', () => {
            const idx = modalManager.remove(modal2);
            expect(idx).toStrictEqual(1);
            expect(modalManager.isTopModal(modal1)).toStrictEqual(true);
        });

        it('should remove modal1', () => {
            const idx = modalManager.remove(modal1);
            expect(idx).toStrictEqual(0);
        });

        it('should not do anything', () => {
            const idx = modalManager.remove({ nonExisting: true } as never);
            expect(idx).toStrictEqual(-1);
        });
    });

    describe('overflow', () => {
        let fixedNode: HTMLElement;

        beforeEach(() => {
            container1.style.paddingRight = '20px';

            fixedNode = document.createElement('div');
            document.body.appendChild(fixedNode);
            (window as Mutable<Window>).innerWidth += 1; // simulate a scrollbar
        });

        afterEach(() => {
            document.body.removeChild(fixedNode);
            (window as Mutable<Window>).innerWidth -= 1;
        });

        it('should handle the scroll', () => {
            fixedNode.style.paddingRight = '14px';

            const modal = {} as ModalElement;
            modalManager.add(modal, container1);
            modalManager.mount(modal);
            expect(container1.style.overflow).toStrictEqual('hidden');
            expect(container1.style.paddingRight).toStrictEqual(`${20 + getScrollbarSize()}px`);
            expect(fixedNode.style.paddingRight).toStrictEqual(`${14 + getScrollbarSize()}px`);
            modalManager.remove(modal);
            expect(container1.style.overflow).toStrictEqual('');
            expect(container1.style.paddingRight).toStrictEqual('20px');
            expect(fixedNode.style.paddingRight).toStrictEqual('14px');
        });

        it('should disable the scroll even when not overflowing', () => {
            // simulate non-overflowing container
            const container2 = document.createElement('div');
            Object.defineProperty(container2, 'scrollHeight', {
                value: 100,
                writable: false,
            });
            Object.defineProperty(container2, 'clientHeight', {
                value: 100,
                writable: false,
            });
            document.body.appendChild(container2);

            const modal = {} as ModalElement;
            modalManager.add(modal, container2);
            modalManager.mount(modal);
            expect(container2.style.overflow).toStrictEqual('hidden');
            modalManager.remove(modal);
            expect(container2.style.overflow).toStrictEqual('');

            document.body.removeChild(container2);
        });

        it('should restore styles correctly if none existed before', () => {
            const modal = {} as ModalElement;

            modalManager.add(modal, container1);
            modalManager.mount(modal);
            expect(container1.style.overflow).toStrictEqual('hidden');
            expect(container1.style.paddingRight).toStrictEqual(`${20 + getScrollbarSize()}px`);
            expect(fixedNode.style.paddingRight).toStrictEqual('');
            modalManager.remove(modal);
            expect(container1.style.overflow).toStrictEqual('');
            expect(container1.style.paddingRight).toStrictEqual('20px');
            expect(fixedNode.style.paddingRight).toStrictEqual('');
        });
    });

    describe('multi container', () => {
        let container3: HTMLDivElement;
        let container4: HTMLDivElement;

        beforeEach(() => {
            container3 = document.createElement('div');
            document.body.appendChild(container3);
            container3.appendChild(document.createElement('div'));

            container4 = document.createElement('div');
            document.body.appendChild(container4);
            container4.appendChild(document.createElement('div'));
        });

        it('should work will multiple containers', () => {
            modalManager = new ModalManager();
            const modal1 = {} as ModalElement;
            const modal2 = {} as ModalElement;
            modalManager.add(modal1, container3);
            modalManager.mount(modal1);
            expect(container3.children[0]).toHaveAttribute('aria-hidden');

            modalManager.add(modal2, container4);
            modalManager.mount(modal2);
            expect(container4.children[0]).toHaveAttribute('aria-hidden');

            modalManager.remove(modal2);
            expect(container4.children[0]).not.toHaveAttribute('aria-hidden');

            modalManager.remove(modal1);
            expect(container3.children[0]).not.toHaveAttribute('aria-hidden');
        });

        afterEach(() => {
            document.body.removeChild(container3);
            document.body.removeChild(container4);
        });
    });

    describe('container aria-hidden', () => {
        let modalRef1;
        let container2: HTMLDivElement;

        beforeEach(() => {
            container2 = document.createElement('div');
            document.body.appendChild(container2);

            modalRef1 = document.createElement('div');
            container2.appendChild(modalRef1);

            modalManager = new ModalManager();
        });

        afterEach(() => {
            document.body.removeChild(container2);
        });

        it('should not contain aria-hidden on modal', () => {
            const modal2 = document.createElement('div');
            modal2.setAttribute('aria-hidden', 'true');

            expect(modal2).toHaveAttribute('aria-hidden');
            modalManager.add({ modalRef: modal2 } as never, container2);
            expect(modal2).not.toHaveAttribute('aria-hidden');
        });

        it('should add aria-hidden to container siblings', () => {
            modalManager.add({} as ModalElement, container2);
            expect(container2.children[0]).toHaveAttribute('aria-hidden');
        });

        it('should add aria-hidden to previous modals', () => {
            const modal2 = document.createElement('div');
            const modal3 = document.createElement('div');

            container2.appendChild(modal2);
            container2.appendChild(modal3);

            modalManager.add({ modalRef: modal2 } as never, container2);
            // Simulate the main React DOM true.
            expect(container2.children[0]).toHaveAttribute('aria-hidden');
            expect(container2.children[1]).not.toHaveAttribute('aria-hidden');

            modalManager.add({ modalRef: modal3 } as never, container2);
            expect(container2.children[0]).toHaveAttribute('aria-hidden');
            expect(container2.children[1]).toHaveAttribute('aria-hidden');
            expect(container2.children[2]).not.toHaveAttribute('aria-hidden');
        });

        it('should remove aria-hidden on siblings', () => {
            const modal = { modalRef: container2.children[0] } as ModalElement;

            modalManager.add(modal, container2);
            modalManager.mount(modal);
            expect(container2.children[0]).not.toHaveAttribute('aria-hidden');
            modalManager.remove(modal);
            expect(container2.children[0]).toHaveAttribute('aria-hidden');
        });

        it('should keep previous aria-hidden siblings hidden', () => {
            const modal = { modalRef: container2.children[0] } as ModalElement;
            const sibling1 = document.createElement('div');
            const sibling2 = document.createElement('div');

            sibling1.setAttribute('aria-hidden', 'true');

            container2.appendChild(sibling1);
            container2.appendChild(sibling2);

            modalManager.add(modal, container2);
            modalManager.mount(modal);
            expect(container2.children[0]).not.toHaveAttribute('aria-hidden');
            modalManager.remove(modal);
            expect(container2.children[0]).toHaveAttribute('aria-hidden');
            expect(container2.children[1]).toHaveAttribute('aria-hidden');
            expect(container2.children[2]).not.toHaveAttribute('aria-hidden');
        });
    });
});
