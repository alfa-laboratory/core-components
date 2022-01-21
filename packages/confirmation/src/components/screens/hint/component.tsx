import React, { useContext } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';
import { Link } from '@alfalab/core-components-link';

import { ConfirmationContext } from '../../../context';

import styles from './index.module.css';

export const Hint = () => {
    const { alignContent, texts, onChangeScreen, onChangeState } = useContext(ConfirmationContext);

    const handleReturnButtonClick = () => {
        onChangeScreen('INITIAL');
        onChangeState('INITIAL');
    };

    return (
        <div className={cn(styles.component, styles[alignContent])}>
            <div className={styles.hintWrap}>
                <h3 className={styles.title}>Не&nbsp;приходит сообщение?</h3>

                <span className={styles.text}>
                    Если у&nbsp;вас изменился номер телефона, позвоните нам или обратитесь
                    в&nbsp;любое отделение банка.
                </span>

                <div className={styles.phonesWrap}>
                    <div className={styles.phoneWrap}>
                        <Link href='tel:+78002000000' className={styles.phoneLink}>
                            8 800 200-00-00
                        </Link>

                        <span className={styles.phoneDescription}>
                            {' '}
                            &mdash;&nbsp;для звонков по&nbsp;России
                        </span>
                    </div>

                    <div className={styles.phoneWrap}>
                        <Link href='tel:+74957888878' className={styles.phoneLink}>
                            +7 495 78-888-78
                        </Link>

                        <span className={styles.phoneDescription}>
                            {' '}
                            &mdash;&nbsp;в&nbsp;Москве и&nbsp;за&nbsp;границей
                        </span>
                    </div>
                </div>

                <span className={styles.text}>
                    Если номер не&nbsp;менялся, возможно, перегружен сервис отправки сообщений.
                    Попробуйте повторить действие через несколько минут.
                </span>

                <Button
                    size='s'
                    view='secondary'
                    onClick={handleReturnButtonClick}
                    className={styles.hintButton}
                >
                    {texts.hintButton}
                </Button>
            </div>
        </div>
    );
};
