/* eslint-disable react/no-find-dom-node,jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import mergeRefs from 'react-merge-refs';

function ownerDocument(node: Element | Document | null) {
    return (node && node.ownerDocument) || document;
}

export type TrapFocusProps = {
    /**
     * Отключает автоматический перевод фокуса внутрь компонента при открытии, и
     * переключение его обратно после закрытия.
     *
     * В большинстве случаев этот параметр не должен устанавливаться в `true`,
     * так как компонент перестаёт отвечать требованиям доступности, например для скринридеров.
     */
    disableAutoFocus?: boolean;

    /**
     * Отключает ограничение перевода фокуса в пределах компонента
     *
     * В большинстве случаев этот параметр не должен устанавливаться в `true`,
     * так как компонент перестаёт отвечать требованиям доступности, например для скринридеров.
     */
    disableEnforceFocus?: boolean;

    /** Отключает восстановление фокуса на предыдущем элементе после скрытия компонента */
    disableRestoreFocus?: boolean;

    /**
     * Возвращает объект Document
     *
     * Нужно для восстановлении фокуса между различными document браузера.
     */
    getDoc(): Document;

    /**
     * Хотим ли мы ещё ограничивать перемещение фокуса?
     *
     * Нужно для вложенных TrapFocus.
     */
    isEnabled(): boolean;

    /** Ограничивает переключение фокуса */
    open: boolean;
};

/**
 * Утилитарный компонент, который фиксирует перемещение фокуса внутри себя
 *
 * TODO: Обновить в будущем, компонент НЕСТАБИЛЬНЫЙ.
 *
 * Заимствовано из [MUI](https://material-ui.com/)
 */
export const TrapFocus: React.FC<TrapFocusProps> = props => {
    const {
        children,
        disableAutoFocus = false,
        disableEnforceFocus = false,
        disableRestoreFocus = false,
        getDoc,
        isEnabled,
        open,
    } = props;
    const ignoreNextEnforceFocus = React.useRef<boolean>();
    const sentinelStart = React.useRef<HTMLDivElement>(null);
    const sentinelEnd = React.useRef<HTMLDivElement>(null);
    const nodeToRestore = React.useRef<HTMLElement | null>();

    const rootRef = React.useRef<HTMLElement | null>(null);
    // can be removed once we drop support for non ref forwarding class components
    const handleOwnRef = React.useCallback(instance => {
        rootRef.current = ReactDOM.findDOMNode(instance) as HTMLElement;
    }, []);

    // TODO: заменить на optional chaining
    const handleRef = mergeRefs([
        (children && (children as { ref: React.Ref<typeof children> }).ref) || null,
        handleOwnRef,
    ]);

    const prevOpenRef = React.useRef<boolean>();
    React.useEffect(() => {
        prevOpenRef.current = open;
    }, [open]);

    if (!prevOpenRef.current && open && typeof window !== 'undefined') {
        nodeToRestore.current = getDoc().activeElement as HTMLElement;
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        const doc = ownerDocument(rootRef.current);

        // We might render an empty child.
        if (!disableAutoFocus && rootRef.current && !rootRef.current.contains(doc.activeElement)) {
            if (!rootRef.current.hasAttribute('tabIndex')) {
                if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.error(
                        [
                            'core-components: The modal content node does not accept focus.',
                            'For the benefit of assistive technologies, ' +
                                'the tabIndex of the node is being set to "-1".',
                        ].join('\n'),
                    );
                }

                rootRef.current.setAttribute('tabIndex', '-1');
            }

            rootRef.current.focus();
        }

        const contain = () => {
            if (
                !doc.hasFocus() ||
                disableEnforceFocus ||
                !isEnabled() ||
                ignoreNextEnforceFocus.current
            ) {
                ignoreNextEnforceFocus.current = false;
                /**
                 * ⚡ Фикс к оригинальной реализации
                 * Чтобы фокус оставался в компоненте после удаления активного дочернего элемента с фокусом
                 */
                if (doc.activeElement !== doc.body) return;
            }

            if (rootRef.current && !rootRef.current.contains(doc.activeElement)) {
                rootRef.current.focus();
            }
        };

        const loopFocus = (event: KeyboardEvent) => {
            // 9 = Tab
            if (disableEnforceFocus || !isEnabled() || event.keyCode !== 9) {
                return;
            }

            // Make sure the next tab starts from the right place.
            if (doc.activeElement === rootRef.current) {
                /*
                 * We need to ignore the next contain as
                 * it will try to move the focus back to the rootRef element.
                 */
                ignoreNextEnforceFocus.current = true;
                if (event.shiftKey) {
                    if (sentinelEnd.current) sentinelEnd.current.focus();
                } else if (sentinelStart.current) sentinelStart.current.focus();
            }
        };

        doc.addEventListener('focus', contain, true);
        doc.addEventListener('keydown', loopFocus, true);

        /*
         * With Edge, Safari and Firefox, no focus related events are fired when the focused area stops being a focused area
         * e.g. https://bugzilla.mozilla.org/show_bug.cgi?id=559561.
         *
         * The whatwg spec defines how the browser should behave but does not explicitly mention any events:
         * https://html.spec.whatwg.org/multipage/interaction.html#focus-fixup-rule.
         */
        const interval = setInterval(() => {
            contain();
        }, 50);

        // eslint-disable-next-line consistent-return
        return () => {
            clearInterval(interval);

            doc.removeEventListener('focus', contain, true);
            doc.removeEventListener('keydown', loopFocus, true);

            // restoreLastFocus()
            if (!disableRestoreFocus) {
                /*
                 * In IE 11 it is possible for document.activeElement to be null resulting
                 * in nodeToRestore.current being null.
                 * Not all elements in IE 11 have a focus method.
                 * Once IE 11 support is dropped the focus() call can be unconditional.
                 */
                if (nodeToRestore.current && nodeToRestore.current.focus) {
                    nodeToRestore.current.focus();
                }

                nodeToRestore.current = null;
            }
        };
    }, [disableAutoFocus, disableEnforceFocus, disableRestoreFocus, isEnabled, open]);

    return (
        <React.Fragment>
            <div tabIndex={0} ref={sentinelStart} data-test-id='sentinelStart' />
            {React.isValidElement(children)
                ? React.cloneElement(children, { ref: handleRef })
                : children}
            <div tabIndex={0} ref={sentinelEnd} data-test-id='sentinelEnd' />
        </React.Fragment>
    );
};
