import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

type CDNIconProps = {
    /**
     * Имя иконки
     */
    name: string;
    /**
     * Цвет иконки
     */
    color?: string;
    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const CDNIcon: React.FC<CDNIconProps> = ({ name, color, dataTestId }) => {
    const [icon, setIcon] = useState('');

    useEffect(() => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://alfabank.st/icons/${name}.svg`);
        xhr.send();
        xhr.onload = function() {
            const svg = xhr.response;
            if (svg.startsWith('<svg')) setIcon(svg);
        };
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
