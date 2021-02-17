import React, { ReactNode, Ref, useContext } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Component';

import styles from './index.module.css';

export type ContentProps = {
    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Растягивает контент на всю высоту
     */
    flex?: boolean;
};

export const Content: React.FC<ContentProps> = ({ children, flex, className }) => {
    const { contentRef } = useContext(ModalContext);

    return (
        <div
            className={cn(styles.content, className, {
                [styles.flex]: flex,
            })}
            ref={contentRef as Ref<HTMLDivElement>}
        >
            {children}
        </div>
    );
};
