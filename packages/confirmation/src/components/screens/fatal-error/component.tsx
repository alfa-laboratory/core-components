import React, { useContext, Fragment } from 'react';
import { Button } from '@alfalab/core-components-button';

import { ConfirmationContext } from '../../../context';

import styles from './index.module.css';

export const FatalError = () => {
    const { texts, onFatalErrorOkButtonClick } = useContext(ConfirmationContext);

    return (
        <Fragment>
            <h3 className={styles.header}>{texts.fatalErrorTitle}</h3>

            <div className={styles.description}>{texts.fatalErrorDescription}</div>

            <Button size='xs' view='secondary' onClick={onFatalErrorOkButtonClick}>
                {texts.fatalErrorButton}
            </Button>
        </Fragment>
    );
};
