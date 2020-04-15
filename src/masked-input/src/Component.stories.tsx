import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import { MaskedInput } from './Component';

import styles from '../../../.storybook/styles.css';

export default {
    title: 'Common|MaskedInput',
    component: MaskedInput,
    decorators: [withKnobs],
};

export const MaskedInputStory = () => {
    // prettier-ignore
    const masks = {
        phone: ['+', /\d/, ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
        card: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    };

    const placeholders = {
        phone: '+7 (000) 000-00-00',
        card: '0000 0000 0000 0000',
    };

    return (
        <div style={{ width: '240px' }}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <MaskedInput mask={masks.phone} placeholder={placeholders.phone} block={true} />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <MaskedInput mask={masks.card} placeholder={placeholders.card} block={true} />
                </div>
            </div>
        </div>
    );
};

MaskedInputStory.story = {
    name: 'MaskedInput',
    parameters: {},
};
