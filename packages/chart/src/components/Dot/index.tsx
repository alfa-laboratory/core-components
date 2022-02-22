import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { PointIcon } from '../../icons/point-icon';
import { DotProps, DotSettingProps } from '../../types/utils/dot.types';

import styles from './index.module.css';

export const Dot = React.forwardRef<SVGSVGElement, DotProps>(
    (
        { cx, cy, index, activeDot, dataKey, dotSettings, value, stroke, unfocusedAnimation },
        ref,
    ): React.ReactElement | null => {
        const [windowWidth, setWindowWidth] = useState<number>(0);

        const [height, setHeight] = useState<number>(0);
        const [width, setWidth] = useState<number>(0);
        const [option, setOption] = useState<DotSettingProps | null>(null);

        useEffect(() => {
            let dotSetting: DotSettingProps =
                Array.isArray(dotSettings) && dotSettings.length > 0
                    ? dotSettings.find(item => item.media && windowWidth < item.media)
                    : dotSettings;

            if (Array.isArray(dotSettings) && dotSettings.length > 0 && !dotSetting) {
                dotSetting = dotSettings[dotSettings.length - 1];
            }

            setWindowWidth(window.innerWidth);
            setOption(dotSetting);
        }, [dotSettings, windowWidth]);

        useEffect(() => {
            if (!option) return;

            if (typeof activeDot === 'number' && activeDot === index) {
                setHeight(option.height * option.scale);
                setWidth(option.width * option.scale);
            } else {
                setHeight(option.height * option.initScale);
                setWidth(option.width * option.initScale);
            }
        }, [activeDot, index, option]);

        if (!value) return null;

        return (
            <g
                ref={ref}
                className={cn(styles.dot)}
                transform={`translate(${cx - width / 2}, ${cy - height / 2})`}
            >
                <g
                    className={cn(styles.dotWrap)}
                    transform={`scale(${
                        activeDot === index ? option?.scale || 0 : option?.initScale || 0
                    })`}
                >
                    <svg
                        className={cn(
                            styles.dotItem,
                            activeDot === index ? styles.dotActive : '',
                            typeof activeDot === 'number' &&
                                activeDot !== index &&
                                unfocusedAnimation
                                ? styles.dotUnfocused
                                : '',
                        )}
                        data-id={index}
                        data-name={dataKey}
                        width={option?.width || 0}
                        height={option?.height || 0}
                    >
                        <PointIcon fill={stroke} />
                    </svg>
                </g>
            </g>
        );
    },
);
