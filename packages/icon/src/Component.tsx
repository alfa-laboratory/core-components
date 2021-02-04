import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

import styles from './index.module.css';

const fallbackIcon =
    '<svg class="star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" fill="none"/>\n' +
    '<path d="M9.25897 8.13104L12 1V8.40327V17L5 21L7.32079 13.8805L7.41378 13.6046L7.17119 13.425L1 8.5L8.87993 8.40327H9.1672L9.25897 8.13104Z" fill="#0B1F35"/>\n' +
    '<path d="M14.741 8.13106L12 1V8.40327V17L19 21L16.6792 13.8805L16.5862 13.6046L16.8288 13.425L23 8.50001L15.1201 8.40328H14.8328L14.741 8.13106Z" fill="#0B1F35"/>\n' +
    '</svg>';

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
                if (svg.startsWith('<svg')) {
                    const cleanSvg = DOMPurify.sanitize(svg, {
                        USE_PROFILES: { svg: true, svgFilters: true },
                    });

                    setIcon(cleanSvg);
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                setIcon(fallbackIcon);
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
