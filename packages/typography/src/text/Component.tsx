import cn from 'classnames';
import React from 'react';

import styles from './index.module.css';

const View = {
    'paragraph-primary-large': styles.paragraphPrimaryLarge,
    'paragraph-primary-normal': styles.paragraphPrimaryNormal,
    'paragraph-primary-small': styles.paragraphPrimarySmall,
    'paragraph-secondary-large': styles.paragraphSecondaryLarge,
    'paragraph-secondary-normal': styles.paragraphSecondaryNormal,
    'paragraph-secondary-small': styles.paragraphSecondarySmall,
    'paragraph-component': styles.paragraphComponent,
    'paragraph-caps': styles.paragraphCaps,
    'accent-primary-large': styles.accentPrimaryLarge,
    'accent-primary-normal': styles.accentPrimaryNormal,
    'accent-primary-small': styles.accentPrimarySmall,
    'accent-secondary-large': styles.accentSecondaryLarge,
    'accent-secondary-normal': styles.accentSecondaryNormal,
    'accent-secondary-small': styles.accentSecondarySmall,
    'accent-component': styles.accentComponent,
    'accent-caps': styles.accentCaps,
    'action-primary-large': styles.actionPrimaryLarge,
    'action-primary-normal': styles.actionPrimaryNormal,
    'action-primary-small': styles.actionPrimarySmall,
    'action-secondary-large': styles.actionSecondaryLarge,
    'action-secondary-normal': styles.actionSecondaryNormal,
    'action-secondary-small': styles.actionSecondarySmall,
    'key-xlarge': styles.keyXlarge,
    'key-large': styles.keyLarge,
    'key-normal': styles.keyNormal,
    'key-small': styles.keySmall,
    'key-xsmall': styles.keyXsmall,
    'legacy-styrene-normal': styles.legacyStyreneNormal,
    'legacy-primary-small': styles.legacyPrimarySmall,
};

type ViewType = keyof typeof View;

export type TextProps = {
    /** Вариант начертания */
    view?: ViewType;
    /** Тип */
    type?: 'secondary' | 'negative' | 'positive' | 'attention';
    /** HTML тег */
    tag?: 'p' | 'span';
    /** Css-класс для стилизации */
    className?: string;
    /** Id компонента для тестов */
    dataTestId?: string;
    /** Контент */
    children?: React.ReactNode;
};

export const Text: React.FC<TextProps> = ({
    view,
    type,
    tag = 'span',
    className,
    dataTestId,
    children,
}: TextProps): React.ReactElement => {
    const Component = tag;
    const viewClass = view ? styles[view] : '';
    const typeClass = type ? styles[type] : '';

    return React.createElement(
        Component,
        {
            className: cn({ [styles.component]: tag === 'p' }, className, viewClass, typeClass),
            'data-test-id': dataTestId,
        },
        children,
    );
};
