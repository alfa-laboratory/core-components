import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

import styles from './index.module.css';

type IconProps = {
    name: string;
    color?: string;
    dataTestId?: string;
};

export const Icon: React.FC<IconProps> = ({ name, color, dataTestId }) => {
    const [icon, setIcon] = useState('');

    useEffect(() => {
        axios
            .get(`https://alfabank.st/icons/${name}.svg`)
            .then(res => res.data)
            .then(svg => {
                const cleanSvg = DOMPurify.sanitize(svg, {
                    USE_PROFILES: { svg: true, svgFilters: true },
                });

                if (cleanSvg.startsWith('<svg')) {
                    setIcon(cleanSvg);
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                console.log('error');
            });
    }, [name]);

    return (
        // eslint-disable-next-line react/no-danger
        <span
            style={{ color }}
            className={styles.iconWrapper}
            dangerouslySetInnerHTML={{ __html: icon }}
            data-test-id={dataTestId}
        />
    );
};
