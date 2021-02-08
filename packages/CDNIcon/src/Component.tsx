import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './index.module.css';

type CDNIconProps = {
    /** Имя иконки */
    name: string;
    /** Цвет иконки */
    color?: string;
    /** Идентификатор для систем автоматизированного тестирования */
    dataTestId?: string;
};

export const CDNIcon: React.FC<CDNIconProps> = ({ name, color, dataTestId }) => {
    const [icon, setIcon] = useState('');

    useEffect(() => {
        axios
            .get(`https://alfabank.st/icons/${name}.svg`)
            .then(res => res.data)
            .then(svg => {
                if (svg.startsWith('<svg')) {
                    setIcon(svg);
                }
            });
    }, [name]);

    return (
        <span
            style={{ color }}
            className={styles.component}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: icon }}
            data-test-id={dataTestId}
        />
    );
};
